from pydantic import BaseModel

# Professor
class ProfessorRegister(BaseModel):
    prof_id: str
    name: str
    password: str

class ProfessorLogin(BaseModel):
    prof_id: str
    password: str

# Student
class StudentRegister(BaseModel):
    student_id: str
    name: str
    batch: str
    password: str

class StudentLogin(BaseModel):
    student_id: str
    password: str

# Course
class CourseCreate(BaseModel):
    batch: str
    course_name: str
