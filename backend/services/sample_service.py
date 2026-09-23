import os
from PIL import Image, ImageDraw, ImageFont

def ensure_sample_documents(samples_dir: str) -> list:
    """
    Creates and returns sample document definitions with rendered sample images.
    """
    os.makedirs(samples_dir, exist_ok=True)
    
    samples = [
        {
            "id": "sample_receipt_coffee",
            "name": "Blue Bottle Coffee Receipt",
            "type": "receipt",
            "filename": "sample_receipt_coffee.png",
            "description": "Retail coffee store receipt with line items and subtotal"
        },
        {
            "id": "sample_invoice_acme",
            "name": "Acme Tech Commercial Invoice",
            "type": "invoice",
            "filename": "sample_invoice_acme.png",
            "description": "Corporate services invoice with tax and discount calculation"
        },
        {
            "id": "sample_id_license",
            "name": "State Driver's License ID",
            "type": "id_card",
            "filename": "sample_id_license.png",
            "description": "Government issued identification card with DOB and expiration"
        }
    ]
    
    for sample in samples:
        path = os.path.join(samples_dir, sample["filename"])
        sample["path"] = path
        if not os.path.exists(path):
            generate_sample_image(sample["id"], path)
            
    return samples


def generate_sample_image(sample_id: str, output_path: str):
    """Generates crisp sample images programmatically using Pillow."""
    if sample_id == "sample_receipt_coffee":
        img = Image.new("RGB", (600, 900), color=(253, 252, 248))
        draw = ImageDraw.Draw(img)
        
        # Header
        draw.rectangle([0, 0, 600, 120], fill=(44, 62, 80))
        draw.text((150, 45), "BLUE BOTTLE COFFEE", fill=(255, 255, 255))
        
        # Details
        draw.text((180, 140), "Date: 2026-09-22 | Time: 09:14 AM", fill=(80, 80, 80))
        draw.text((220, 165), "Order #8842 - Station 3", fill=(100, 100, 100))
        draw.line([(40, 200), (560, 200)], fill=(200, 200, 200), width=2)
        
        # Line Items
        draw.text((50, 220), "ITEMS", fill=(40, 40, 40))
        draw.text((480, 220), "PRICE", fill=(40, 40, 40))
        
        items = [
            ("2x Double Espresso Roast", "$9.00"),
            ("1x Oat Milk Mocha", "$6.50"),
            ("1x Almond Croissant", "$1.00"),
        ]
        y = 260
        for name, price in items:
            draw.text((50, y), name, fill=(50, 50, 50))
            draw.text((480, y), price, fill=(50, 50, 50))
            y += 45
            
        draw.line([(40, y + 20), (560, y + 20)], fill=(200, 200, 200), width=2)
        y += 50
        
        # Totals
        draw.text((320, y), "Subtotal:", fill=(80, 80, 80))
        draw.text((480, y), "$16.50", fill=(80, 80, 80))
        y += 40
        draw.text((320, y), "Tax (8.8%):", fill=(80, 80, 80))
        draw.text((480, y), "$1.45", fill=(80, 80, 80))
        y += 50
        
        draw.rectangle([300, y - 10, 560, y + 45], fill=(235, 245, 251))
        draw.text((320, y + 5), "TOTAL:", fill=(44, 62, 80))
        draw.text((480, y + 5), "$17.95", fill=(44, 62, 80))
        
        # Footer
        draw.text((180, 820), "Thank you for visiting Blue Bottle!", fill=(140, 140, 140))
        img.save(output_path)

    elif sample_id == "sample_invoice_acme":
        img = Image.new("RGB", (800, 1100), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        
        # Header banner
        draw.rectangle([0, 0, 800, 150], fill=(20, 35, 60))
        draw.text((60, 50), "ACME TECH SOLUTIONS INC.", fill=(255, 255, 255))
        draw.text((60, 95), "100 Silicon Way, San Francisco CA", fill=(180, 200, 220))
        
        draw.text((580, 45), "INVOICE", fill=(255, 255, 255))
        draw.text((580, 90), "INV-2026-8842", fill=(240, 180, 40))
        
        # Dates & Bill To
        draw.text((60, 180), "BILL TO:", fill=(100, 100, 100))
        draw.text((60, 210), "Global Enterprise Corp", fill=(20, 20, 20))
        draw.text((60, 235), "450 Fifth Avenue, New York NY", fill=(60, 60, 60))
        
        draw.text((500, 180), "Invoice Date: 2026-09-15", fill=(60, 60, 60))
        draw.text((500, 210), "Payment Due: 2026-10-15", fill=(60, 60, 60))
        
        # Line Items Table
        draw.rectangle([50, 300, 750, 340], fill=(240, 244, 248))
        draw.text((70, 310), "Description", fill=(40, 40, 40))
        draw.text((450, 310), "Qty", fill=(40, 40, 40))
        draw.text((550, 310), "Unit Price", fill=(40, 40, 40))
        draw.text((660, 310), "Total", fill=(40, 40, 40))
        
        y = 360
        items = [
            ("Cloud Architecture Consulting", "10", "$100.00", "$1000.00"),
            ("Enterprise API Gateway License", "1", "$250.00", "$250.00"),
        ]
        for desc, qty, rate, amt in items:
            draw.text((70, y), desc, fill=(30, 30, 30))
            draw.text((450, y), qty, fill=(30, 30, 30))
            draw.text((550, y), rate, fill=(30, 30, 30))
            draw.text((660, y), amt, fill=(30, 30, 30))
            y += 40
            
        draw.line([(50, y + 20), (750, y + 20)], fill=(220, 220, 220), width=2)
        y += 50
        
        draw.text((480, y), "Subtotal:", fill=(80, 80, 80))
        draw.text((660, y), "$1250.00", fill=(80, 80, 80))
        y += 35
        draw.text((480, y), "Discount:", fill=(80, 80, 80))
        draw.text((660, y), "-$50.00", fill=(80, 80, 80))
        y += 35
        draw.text((480, y), "Tax:", fill=(80, 80, 80))
        draw.text((660, y), "$100.00", fill=(80, 80, 80))
        y += 45
        
        draw.rectangle([460, y - 10, 750, y + 45], fill=(230, 245, 235))
        draw.text((480, y + 5), "TOTAL DUE:", fill=(20, 100, 40))
        draw.text((660, y + 5), "$1300.00", fill=(20, 100, 40))
        
        img.save(output_path)

    elif sample_id == "sample_id_license":
        img = Image.new("RGB", (700, 450), color=(230, 240, 250))
        draw = ImageDraw.Draw(img)
        
        # Card Header
        draw.rectangle([0, 0, 700, 80], fill=(30, 90, 160))
        draw.text((40, 25), "STATE DRIVER LICENSE", fill=(255, 255, 255))
        draw.text((500, 25), "USA IDENTIFICATION", fill=(200, 230, 255))
        
        # Photo box
        draw.rectangle([40, 110, 200, 310], fill=(180, 200, 220), outline=(30, 90, 160), width=3)
        draw.text((80, 200), "PHOTO", fill=(100, 120, 140))
        
        # Field labels & values
        draw.text((230, 105), "DL NUMBER:", fill=(100, 100, 100))
        draw.text((360, 105), "D8394-0291-88", fill=(200, 30, 30))
        
        draw.text((230, 150), "LN: MERCER", fill=(20, 20, 20))
        draw.text((230, 180), "FN: ALEX J.", fill=(20, 20, 20))
        
        draw.text((230, 220), "DOB: 1994-06-14", fill=(50, 50, 50))
        draw.text((440, 220), "EXP: 2028-06-14", fill=(30, 120, 30))
        
        draw.text((230, 260), "ADDRESS:", fill=(100, 100, 100))
        draw.text((230, 285), "742 Evergreen Terrace", fill=(40, 40, 40))
        draw.text((230, 310), "Springfield, OR 97477", fill=(40, 40, 40))
        
        draw.rectangle([0, 400, 700, 450], fill=(210, 220, 230))
        draw.text((40, 415), "CLASS: C  |  REST: NONE  |  END: NONE", fill=(80, 80, 80))
        
        img.save(output_path)
