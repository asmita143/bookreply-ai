from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from app.models.email import Email
from email.utils import parseaddr
import base64
import os

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_gmail_service():
    creds = None

    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    if not creds:
        flow = InstalledAppFlow.from_client_secrets_file(
            'secrets/credentials.json', SCOPES
        )
        creds = flow.run_local_server(port=0)

        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('gmail', 'v1', credentials=creds)
    return service

def fetch_emails(max_results=10):
    service = get_gmail_service()

    results = service.users().messages().list(
        userId='me',
        maxResults=max_results
    ).execute()

    messages = results.get('messages', [])
    emails = []

    for msg in messages:
        msg_data = service.users().messages().get(
            userId='me',
            id=msg['id'],
            format='full'
        ).execute()

        payload = msg_data['payload']
        headers = payload['headers']

        subject = next(h['value'] for h in headers if h['name'] == 'Subject')
        raw_sender = next(h['value'] for h in headers if h['name'] == 'From')

        full_name, sender_email = parseaddr(raw_sender)

        body = ""
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain':
                    body = base64.urlsafe_b64decode(
                        part['body']['data']
                    ).decode()
        else:
            body = base64.urlsafe_b64decode(
                payload['body']['data']
            ).decode()

        emails.append(
            Email(
                gmail_id=msg["id"],
                full_name=full_name,
                sender=sender_email,
                subject=subject,
                body=body
            )
        )


    return emails
