from datetime import datetime
from app.models.email import Email
from app.db.firebase import db

COLLECTION = "emails"

def save_email(email: Email):
    doc_ref = db.collection(COLLECTION).document()
    doc_ref.set({
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


