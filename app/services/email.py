import os
import httpx

def send_system_email(to_email: str, subject: str, html_content: str):
    brevo_api_key = os.getenv("BREVO_API_KEY")
    if brevo_api_key:
        try:
            url = "https://api.brevo.com/v3/smtp/email"
            headers = {
                "accept": "application/json",
                "api-key": brevo_api_key,
                "content-type": "application/json"
            }
            sender_email = os.getenv("SMTP_USER", "noreply@nyawit.ai")
            payload = {
                "sender": {"name": "Nyawit AI", "email": sender_email},
                "to": [{"email": to_email}],
                "subject": subject,
                "htmlContent": html_content
            }
            response = httpx.post(url, headers=headers, json=payload)
            if response.status_code in [200, 201, 202]:
                print(f"✅ Email successfully sent to {to_email} via Brevo API")
                return True
            else:
                print(f"❌ Failed via Brevo API: {response.text}")
        except Exception as e:
            print(f"❌ Failed to send email via Brevo API: {e}")
    return False

def send_verification_email(to_email: str, token: str):
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000").rstrip('/')
    verify_link = f"{backend_url}/api/verify-email?token={token}"
    html = f"""<html><body>
        <h3>Selamat Datang di Nyawit AI,</h3>
        <p>Silakan verifikasi email organisasi Anda dengan mengklik tombol di bawah ini:</p>
        <p><a href="{verify_link}" style="background-color: #04211a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verifikasi Email</a></p>
    </body></html>"""
    return send_system_email(to_email, "Verifikasi Akun Organisasi - Nyawit AI", html)

def send_invite_email(to_email: str, invite_code: str, company_name: str):
    html = f"""<html><body>
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e2d6; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #04211a; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Nyawit<span style="color: #10b981;">AI</span></h1>
            </div>
            <div style="padding: 30px;">
                <h3 style="margin-top: 0;">Halo,</h3>
                <p>Anda telah diundang untuk bergabung dengan organisasi <b>{company_name}</b> di Nyawit AI.</p>
                <p>Gunakan kode undangan berikut saat mendaftar (Join Organization):</p>
                <div style="background-color: #fcfbf7; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #10b981;">
                    <h2 style="color: #10b981; letter-spacing: 4px; margin: 0;">{invite_code}</h2>
                </div>
                <p style="color: #64748b; font-size: 12px;">Kode ini berlaku selama 7 hari.</p>
            </div>
        </div>
    </body></html>"""
    return send_system_email(to_email, f"Undangan Bergabung - {company_name}", html)

def send_reset_password_email(to_email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip('/')
    reset_link = f"{frontend_url}/reset-password?token={token}"
    html = f"""<html><body>
        <h3>Atur Ulang Password Anda,</h3>
        <p>Silakan atur ulang password akun Nyawit AI Anda dengan mengklik tombol di bawah ini:</p>
        <p><a href="{reset_link}" style="background-color: #04211a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Atur Ulang Password</a></p>
    </body></html>"""
    return send_system_email(to_email, "Atur Ulang Password - Nyawit AI", html)

def send_approval_email(to_email: str, company_name: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip('/')
    html = f"""<html><body>
        <h3>Selamat!</h3>
        <p>Admin dari organisasi <b>{company_name}</b> telah menyetujui pendaftaran Anda.</p>
        <p>Silakan klik link di bawah ini untuk login ke akun Anda:</p>
        <p><a href="{frontend_url}/auth" style="background-color: #04211a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Login Sekarang</a></p>
    </body></html>"""
    return send_system_email(to_email, "Pendaftaran Anda Telah Disetujui - Nyawit AI", html)
