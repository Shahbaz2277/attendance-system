from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# ---------------- PROFESSOR ----------------
class ProfessorIn(BaseModel):
    prof_id: str
    name: str
    password: str  # Professor sets their own password


class ProfessorLogin(BaseModel):
    prof_id: str
    password: str


class ProfessorOut(BaseModel):
    """Schema for professor data returned to the client (excludes password)."""
    prof_id: str
    name: str

    class Config:
        orm_mode = True


# ---------------- COURSE ----------------
class CourseIn(BaseModel):
    course_name: str
    batch_id: int
    prof_id: str


class CourseDelete(BaseModel):
    course_id: int


class CourseOut(BaseModel):
    id: int
    course_name: str
    batch_id: int
    prof_id: str

    class Config:
        orm_mode = True


# ---------------- STUDENT ----------------
class StudentLogin(BaseModel):
    student_id: str
    password: str


class StudentAddIn(BaseModel):
    student_id: str
    name: str
    password: str  # Must be provided by professor or student
    course_id: int
    batch_id: Optional[int] = None


class StudentOut(BaseModel):
    student_id: str
    name: str
    courses: Optional[List[CourseOut]] = []

    class Config:
        orm_mode = True


# ---------------- ENROLLMENT ----------------
class EnrollmentIn(BaseModel):
    student_id: str
    course_id: int


# ---------------- ATTENDANCE ----------------
class AttendanceIn(BaseModel):
    student_id: str
    course_id: int
    status: str
    att_date: Optional[date] = None  # Optional date for attendance


# ---------------- RESPONSE MODELS ----------------
class LoginResponse(BaseModel):
    valid: bool
    student_id: Optional[str] = None
    name: Optional[str] = None
    courses: Optional[List[CourseOut]] = []
    
class StudentSetPassword(BaseModel):
    student_id: str
    password: str