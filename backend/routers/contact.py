"""
contact.py — POST /contact form submission endpoint.

Accepts name, email, message from the portfolio contact form.
Logs the submission and optionally sends an email notification.
No AI involved — simple validation and delivery.
"""

from fastapi import APIRouter, HTTPException
from models.contact import ContactRequest
from core.config import settings

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("")
async def contact(request: ContactRequest):
    """
    Handle a contact form submission.

    Currently logs to console. Email sending can be wired in here
    when an SMTP service (e.g. Resend, SendGrid) is configured.
    """
    # Log the submission (always, regardless of email config)
    print(
        f"[contact] New message from {request.name} <{request.email}>:\n"
        f"{request.message[:200]}{'...' if len(request.message) > 200 else ''}"
    )

    # -----------------------------------------------------------------------
    # Email delivery — wire in your preferred provider here.
    # Example with Resend (recommended):
    #
    # import resend
    # resend.api_key = settings.resend_api_key
    # resend.Emails.send({
    #     "from": "portfolio@yourdomain.com",
    #     "to": settings.contact_email,
    #     "subject": f"Portfolio contact from {request.name}",
    #     "text": f"From: {request.name} <{request.email}>\n\n{request.message}",
    # })
    # -----------------------------------------------------------------------

    return {"status": "ok", "message": "Message received. Garv will be in touch soon."}
