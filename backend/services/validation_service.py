import re
from datetime import datetime
from typing import Dict, Any, List, Tuple

def parse_float(val: Any) -> float:
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        # Clean currency characters, commas, spaces
        cleaned = re.sub(r'[^\d.-]', '', val)
        try:
            return float(cleaned) if cleaned else 0.0
        except ValueError:
            return 0.0
    return 0.0

def normalize_date(date_str: Any) -> str:
    if not date_str or not isinstance(date_str, str):
        return ""
    date_str = date_str.strip()
    
    # Already YYYY-MM-DD
    if re.match(r'^\d{4}-\d{2}-\d{2}$', date_str):
        return date_str
        
    formats = [
        "%m/%d/%Y", "%m/%d/%y", "%d/%m/%Y", "%d/%m/%y",
        "%Y/%m/%d", "%b %d, %Y", "%B %d, %Y", "%d-%b-%Y", "%d %B %Y"
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
            
    return date_str

def validate_and_enrich_extraction(doc_type: str, extracted_data: Dict[str, Any]) -> Dict[str, Any]:
    discrepancies: List[Dict[str, str]] = []
    
    # 1. Normalize dates
    if "date" in extracted_data:
        extracted_data["date"] = normalize_date(extracted_data.get("date"))
    if "issue_date" in extracted_data:
        extracted_data["issue_date"] = normalize_date(extracted_data.get("issue_date"))
    if "due_date" in extracted_data:
        extracted_data["due_date"] = normalize_date(extracted_data.get("due_date"))
    if "expiration_date" in extracted_data:
        extracted_data["expiration_date"] = normalize_date(extracted_data.get("expiration_date"))

    # 2. Document type specific math validation
    if doc_type in ["receipt", "invoice"]:
        subtotal = parse_float(extracted_data.get("subtotal", 0))
        tax = parse_float(extracted_data.get("tax", 0))
        shipping = parse_float(extracted_data.get("shipping", 0))
        discount = parse_float(extracted_data.get("discount", 0))
        total = parse_float(extracted_data.get("total_amount", 0))
        
        # Line item subtotal verification
        line_items = extracted_data.get("line_items", [])
        calculated_line_subtotal = 0.0
        
        for idx, item in enumerate(line_items):
            qty = parse_float(item.get("quantity", 1))
            unit_price = parse_float(item.get("unit_price", 0))
            expected_total = round(qty * unit_price, 2)
            actual_total = parse_float(item.get("total_price", expected_total))
            
            # Enrich item total price if missing
            item["quantity"] = qty
            item["unit_price"] = unit_price
            item["total_price"] = actual_total if actual_total > 0 else expected_total
            
            calculated_line_subtotal += item["total_price"]
            
            if abs(expected_total - actual_total) > 0.05 and actual_total > 0 and qty > 0 and unit_price > 0:
                discrepancies.append({
                    "field": f"line_items[{idx}]",
                    "issue": f"Line item math mismatch: Qty {qty} x ${unit_price:.2f} = ${expected_total:.2f}, but listed as ${actual_total:.2f}."
                })

        calculated_line_subtotal = round(calculated_line_subtotal, 2)
        
        # Check subtotal against line items sum
        if subtotal > 0 and calculated_line_subtotal > 0 and abs(subtotal - calculated_line_subtotal) > 0.1:
            discrepancies.append({
                "field": "subtotal",
                "issue": f"Subtotal mismatch: Listed ${subtotal:.2f} does not equal sum of line items (${calculated_line_subtotal:.2f})."
            })
            
        # Check overall financial total: Subtotal + Tax + Shipping - Discount == Total
        expected_total = round((subtotal or calculated_line_subtotal) + tax + shipping - discount, 2)
        if total > 0 and expected_total > 0 and abs(total - expected_total) > 0.1:
            discrepancies.append({
                "field": "total_amount",
                "issue": f"Total amount discrepancy: Calculated subtotal (${subtotal or calculated_line_subtotal:.2f}) + tax (${tax:.2f}) - discount (${discount:.2f}) = ${expected_total:.2f}, but document states ${total:.2f}."
            })
            
        # Standardize numerical values in main payload
        extracted_data["subtotal"] = subtotal if subtotal > 0 else calculated_line_subtotal
        extracted_data["tax"] = tax
        extracted_data["total_amount"] = total if total > 0 else expected_total
        
    elif doc_type == "id_card":
        exp_date_str = extracted_data.get("expiration_date", "")
        if exp_date_str:
            try:
                exp_dt = datetime.strptime(exp_date_str, "%Y-%m-%d")
                if exp_dt < datetime.now():
                    discrepancies.append({
                        "field": "expiration_date",
                        "issue": f"Warning: ID document expired on {exp_date_str}."
                    })
            except ValueError:
                pass

    # 3. Assess overall confidence & status assignment
    conf_scores = extracted_data.get("confidence_scores", {})
    avg_confidence = 0.95
    if isinstance(conf_scores, dict) and conf_scores:
        valid_scores = [float(v) for v in conf_scores.values() if isinstance(v, (int, float))]
        if valid_scores:
            avg_confidence = round(sum(valid_scores) / len(valid_scores), 2)
            
    has_discrepancy = len(discrepancies) > 0
    
    if not has_discrepancy and avg_confidence >= 0.85:
        status = "Verified"
        status_color = "green"
    elif has_discrepancy and avg_confidence >= 0.70:
        status = "Review Needed"
        status_color = "yellow"
    else:
        status = "Attention Needed"
        status_color = "red"
        
    return {
        "data": extracted_data,
        "discrepancies": discrepancies,
        "confidence_score": avg_confidence,
        "has_discrepancy": has_discrepancy,
        "status": status,
        "status_color": status_color
    }
