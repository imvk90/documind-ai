import os
import io
from PIL import Image

def process_uploaded_file(file_bytes: bytes, filename: str, output_dir: str) -> dict:
    """
    Saves uploaded file. If PDF, converts first page to high-DPI image and saves it.
    Returns metadata dict with paths to the image and original file.
    """
    os.makedirs(output_dir, exist_ok=True)
    ext = os.path.splitext(filename)[1].lower()
    base_name = os.path.splitext(filename)[0]
    
    saved_file_path = os.path.join(output_dir, filename)
    with open(saved_file_path, "wb") as f:
        f.write(file_bytes)
        
    image_path = saved_file_path
    is_pdf = ext == ".pdf"
    num_pages = 1

    if is_pdf:
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(saved_file_path)
            num_pages = len(doc)
            page = doc.load_page(0)
            pix = page.get_pixmap(dpi=300)
            image_filename = f"{base_name}_page1.png"
            image_path = os.path.join(output_dir, image_filename)
            pix.save(image_path)
            doc.close()
        except Exception as e:
            print(f"Warning: PyMuPDF conversion failed ({e}), attempting fallback...")
            # Fallback or keep pdf path
            
    # Load PIL Image to get dimensions
    try:
        with Image.open(image_path) as img:
            width, height = img.size
    except Exception:
        width, height = 800, 1100

    return {
        "original_filename": filename,
        "saved_file_path": saved_file_path,
        "image_path": image_path,
        "image_filename": os.path.basename(image_path),
        "is_pdf": is_pdf,
        "num_pages": num_pages,
        "dimensions": {"width": width, "height": height}
    }
