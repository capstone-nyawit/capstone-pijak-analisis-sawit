from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class RegisterIndividual(BaseModel):
    full_name: str = Field(...)
    email: EmailStr
    password: str = Field(..., min_length=8, pattern=r".*[A-Z].*")

class RegisterOrganization(BaseModel):
    full_name: str = Field(...)
    company_name: str = Field(...)
    email: EmailStr
    password: str = Field(..., min_length=8, pattern=r".*[A-Z].*")

class JoinOrganization(BaseModel):
    full_name: str = Field(...)
    email: EmailStr
    password: str = Field(..., min_length=8, pattern=r".*[A-Z].*")
    invite_code: str = Field(...)

class InviteRequest(BaseModel):
    email: Optional[EmailStr] = None

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: Optional[str]
    company_name: Optional[str]
    username: str
    email: str
    role: str
    status: str
    profile_photo: Optional[str] = None
    company_id: Optional[int] = None
    is_online: Optional[bool] = None
    last_active: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8, pattern=r".*[A-Z].*")

class ProfileUpdateRequest(BaseModel):
    full_name: str = Field(...)
    profile_photo: Optional[str] = None

class PasswordUpdateRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8, pattern=r".*[A-Z].*")

class EmailUpdateRequest(BaseModel):
    new_email: EmailStr

class RequestEmailChange(BaseModel):
    old_email: EmailStr
    password: str

class ConfirmEmailChange(BaseModel):
    token: str
    new_email: EmailStr
