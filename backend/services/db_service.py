import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "extractions.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS extractions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            file_path TEXT,
            document_type TEXT NOT NULL,
            extraction_date TEXT NOT NULL,
            confidence_score REAL,
            has_discrepancy INTEGER DEFAULT 0,
            status TEXT NOT NULL,
            data_json TEXT NOT NULL,
            bounding_boxes_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_extraction(
    filename: str,
    file_path: str,
    document_type: str,
    confidence_score: float,
    has_discrepancy: bool,
    status: str,
    data: Dict[str, Any],
    bounding_boxes: Optional[Dict[str, Any]] = None
) -> int:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    extraction_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data_json_str = json.dumps(data)
    boxes_json_str = json.dumps(bounding_boxes or {})
    
    cursor.execute('''
        INSERT INTO extractions (
            filename, file_path, document_type, extraction_date,
            confidence_score, has_discrepancy, status, data_json, bounding_boxes_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        filename, file_path, document_type, extraction_date,
        confidence_score, 1 if has_discrepancy else 0, status, data_json_str, boxes_json_str
    ))
    
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def get_all_extractions(limit: int = 50) -> List[Dict[str, Any]]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM extractions ORDER BY id DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        item = dict(row)
        item['data'] = json.loads(item['data_json'])
        item['bounding_boxes'] = json.loads(item['bounding_boxes_json']) if item['bounding_boxes_json'] else {}
        item['has_discrepancy'] = bool(item['has_discrepancy'])
        del item['data_json']
        del item['bounding_boxes_json']
        results.append(item)
    return results

def get_extraction_by_id(record_id: int) -> Optional[Dict[str, Any]]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM extractions WHERE id = ?', (record_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
    item = dict(row)
    item['data'] = json.loads(item['data_json'])
    item['bounding_boxes'] = json.loads(item['bounding_boxes_json']) if item['bounding_boxes_json'] else {}
    item['has_discrepancy'] = bool(item['has_discrepancy'])
    del item['data_json']
    del item['bounding_boxes_json']
    return item

def delete_extraction(record_id: int) -> bool:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM extractions WHERE id = ?', (record_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted
