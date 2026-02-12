from datetime import datetime
from app.models.email import Email
from app.db.firebase import db
from app.services.request_classifier import detect_request_type

COLLECTION = "emails"

def email_exists(gmail_id: str):
    docs = db.collection("emails") \
        .where("gmail_id", "==", gmail_id) \
        .limit(1).get()

    return len(docs) > 0

def save_email(email: Email):
    
    text = f"{email.subject} {email.body}"
    intent = detect_request_type(text)
    email.intent = intent
    
    doc_ref = db.collection(COLLECTION).document(email.gmail_id)
    doc_ref.set({
        "gmail_id": email.gmail_id, 
        "full_name": email.full_name,
        "sender": email.sender,
        "subject": email.subject,
        "body": email.body,
        "intent": email.intent,
        "ai_reply": email.ai_reply,
        "created_at": datetime.utcnow()
    })
    return doc_ref.id

def get_all_emails():
    docs = db.collection(COLLECTION).stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]


def get_email_by_id(email_id: str):
    doc_ref = db.collection("emails").document(email_id)
    doc = doc_ref.get()

    if doc.exists:
        return doc.to_dict()
    else:
        return None


