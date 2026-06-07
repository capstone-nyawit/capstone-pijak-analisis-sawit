import os
from dotenv import load_dotenv

load_dotenv()

from app.services.email import send_system_email

print("API KEY:", os.getenv("BREVO_API_KEY"))
print("SMTP USER:", os.getenv("SMTP_USER"))

res = send_system_email("diopramudya73@gmail.com", "Test Reset Password", "<p>Test</p>")
print("Result:", res)
