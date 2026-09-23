import os
import json
import io
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from typing import Optional, Dict, Any

from services.pdf_service import process_uploaded_file
from services.gemini_service import extract_with_gemini, get_mock_extraction
from services.validation_service import validate_and_enrich_extraction
from services.db_service import (
    init_db, save_extraction, get_all_extractions,
    get_extraction_by_id, delete_extraction
)
from services.sample_service import ensure_sample_documents

app = FastAPI(title="AI-Powered Document Data Extractor API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)

if os.environ.get("VERCEL"):
    UPLOADS_DIR = "/tmp/uploads"
    SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
else:
    UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
    SAMPLES_DIR = os.path.join(BASE_DIR, "samples")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

# Initialize database and sample documents on startup
@app.on_event("startup")
def startup_event():
    init_db()
    ensure_sample_documents(SAMPLES_DIR)

app.mount("/static/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
app.mount("/static/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")

FRONTEND_DIST = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/")
    def serve_frontend_index():
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))



@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "AI Document Extractor", "version": "2.0"}


@app.get("/api/samples")
def get_samples():
    samples = ensure_sample_documents(SAMPLES_DIR)
    results = []
    for s in samples:
        results.append({
            "id": s["id"],
            "name": s["name"],
            "type": s["type"],
            "description": s["description"],
            "filename": s["filename"],
            "image_url": f"/static/samples/{s['filename']}"
        })
    return results


@app.post("/api/extract")
async def extract_document(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None)
):
    try:
        image_path = None
        filename = ""
        image_url = ""

        if file:
            contents = await file.read()
            processed = process_uploaded_file(contents, file.filename, UPLOADS_DIR)
            image_path = processed["image_path"]
            filename = file.filename
            image_url = f"/static/uploads/{processed['image_filename']}"

        elif sample_id:
            samples = ensure_sample_documents(SAMPLES_DIR)
            match = next((s for s in samples if s["id"] == sample_id), None)
            if not match:
                raise HTTPException(status_code=404, detail="Sample document not found")
            image_path = match["path"]
            filename = match["filename"]
            image_url = f"/static/samples/{match['filename']}"
        else:
            raise HTTPException(status_code=400, detail="Must provide either an uploaded file or a sample_id.")

        # 1. Gemini AI extraction (Single pass vision)
        raw_extraction = extract_with_gemini(image_path, api_key=x_api_key)
        doc_type = raw_extraction.get("document_type", "receipt")
        bounding_boxes = raw_extraction.get("bounding_boxes", {})

        # 2. Validation & Math Reconciliation Engine
        validated_result = validate_and_enrich_extraction(doc_type, raw_extraction)

        # 3. Save extraction to SQLite DB
        record_id = save_extraction(
            filename=filename,
            file_path=image_url,
            document_type=doc_type,
            confidence_score=validated_result["confidence_score"],
            has_discrepancy=validated_result["has_discrepancy"],
            status=validated_result["status"],
            data=validated_result["data"],
            bounding_boxes=bounding_boxes
        )

        return {
            "record_id": record_id,
            "filename": filename,
            "image_url": image_url,
            "document_type": doc_type,
            "data": validated_result["data"],
            "discrepancies": validated_result["discrepancies"],
            "confidence_score": validated_result["confidence_score"],
            "has_discrepancy": validated_result["has_discrepancy"],
            "status": validated_result["status"],
            "status_color": validated_result["status_color"],
            "bounding_boxes": bounding_boxes
        }

    except Exception as e:
        print(f"Extraction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/history")
def get_history():
    return get_all_extractions(limit=50)


@app.delete("/api/history/{record_id}")
def remove_history(record_id: int):
    deleted = delete_extraction(record_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"success": True, "deleted_id": record_id}


@app.post("/api/export")
def export_data(payload: Dict[str, Any]):
    export_format = payload.get("format", "json").lower()
    data = payload.get("data", {})
    filename = payload.get("filename", "extracted_data")

    if export_format == "json":
        content = json.dumps(data, indent=2)
        stream = io.BytesIO(content.encode('utf-8'))
        return StreamingResponse(
            stream,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}.json"}
        )

    elif export_format == "csv":
        import pandas as pd
        flat_dict = {}
        for k, v in data.items():
            if isinstance(v, (dict, list)):
                flat_dict[k] = json.dumps(v)
            else:
                flat_dict[k] = v
        df = pd.DataFrame([flat_dict])
        output = io.StringIO()
        df.to_csv(output, index=False)
        stream = io.BytesIO(output.getvalue().encode('utf-8'))
        return StreamingResponse(
            stream,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}.csv"}
        )

    elif export_format == "xlsx":
        import pandas as pd
        flat_dict = {}
        for k, v in data.items():
            if isinstance(v, (dict, list)):
                flat_dict[k] = json.dumps(v)
            else:
                flat_dict[k] = v
        df = pd.DataFrame([flat_dict])
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Extracted Data')
        stream = io.BytesIO(output.getvalue())
        return StreamingResponse(
            stream,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}.xlsx"}
        )

    else:
        raise HTTPException(status_code=400, detail="Invalid format. Use json, csv, or xlsx.")
