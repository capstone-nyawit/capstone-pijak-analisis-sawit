from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class RegisterIndividual(BaseModel):
    full_name: str = Field(...)
    email: EmailStr
    password: str = Field(..., min_length=6)

class RegisterOrganization(BaseModel):
    full_name: str = Field(...)
    company_name: str = Field(...)
    email: EmailStr
    password: str = Field(..., min_length=6)

class JoinOrganization(BaseModel):
    full_name: str = Field(...)
    email: EmailStr
    password: str = Field(..., min_length=6)
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
    company_id: Optional[int] = None

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
    password: str = Field(..., min_length=6)
