from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

from . import models, crud, schemas
from .database import engine, SessionLocal

# ---------------- CREATE DATABASE TABLES ----------------
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Attendance Management System")

# ---------------- DATABASE SESSION ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"message": "Welcome to Attendance Management System API"}

# ---------------- DEBUG ----------------
@app.get("/debug/professors")
def view_all_professors(db: Session = Depends(get_db)):
    return db.query(models.Professor).all()

@app.get("/debug/students")
def view_all_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

# ---------------- PROFESSOR ----------------
@app.post("/professor/register", response_model=schemas.ProfessorOut)
def register_professor(prof: schemas.ProfessorIn, db: Session = Depends(get_db)):
    return crud.create_professor(db, prof.prof_id, prof.name, prof.password)

@app.post("/professor/login")
def login_professor(prof: schemas.ProfessorLogin, db: Session = Depends(get_db)):
    prof_obj = crud.login_professor(db, prof.prof_id, prof.password)
    if not prof_obj:
        return {"valid": False, "error": "Invalid ID or password"}
    return {
        "valid": True,
        "prof_id": prof_obj.prof_id,
        "name": prof_obj.name
    }

# ---------------- COURSE ----------------
@app.post("/course/add")
def add_course(course: schemas.CourseIn, db: Session = Depends(get_db)):
    return crud.create_course(
        db,
        course.course_name,
        course.batch_id,
        course.prof_id
    )

@app.delete("/course/delete")
def delete_course(course: schemas.CourseDelete, db: Session = Depends(get_db)):
    return crud.delete_course(db, course.course_id)

@app.get("/courses/{batch_id}/{prof_id}")
def get_courses(batch_id: int, prof_id: str, db: Session = Depends(get_db)):
    return crud.get_courses_by_batch(db, batch_id, prof_id)

# ---------------- STUDENT ----------------
# ---------------- STUDENT LOGIN ----------------
@app.post("/student/login")
def login_student(student: schemas.StudentLogin, db: Session = Depends(get_db)):
    """
    Student login: backward-compatible with frontend.
    - If password exists: normal login
    - If password not set: first login, prompt to set password
    """
    student_obj = crud.get_student_by_id(db, student.student_id)
    if not student_obj:
        return {"valid": False, "error": "Student ID not found"}

    if not student_obj.password:  # first login
        return {
            "valid": True,
            "student_id": student_obj.student_id,
            "name": student_obj.name,
            "message": "Please set your password first"
        }

    # check password
    if student_obj.password != student.password:
        return {"valid": False, "error": "Invalid password"}

    courses = crud.get_student_courses(db, student.student_id)
    return {
        "valid": True,
        "student_id": student_obj.student_id,
        "name": student_obj.name,
        "courses": [
            {
                "id": c.id,
                "course_name": c.course_name,
                "batch_id": c.batch_id,
                "prof_id": c.prof_id,
            }
            for c in courses
        ],
    }

# ---------------- SET PASSWORD ----------------
@app.post("/student/set-password")
def set_password(student: schemas.StudentSetPassword, db: Session = Depends(get_db)):
    """
    Student sets password on first login
    """
    student_obj = crud.get_student_by_id(db, student.student_id)
    if not student_obj:
        return {"valid": False, "error": "Student ID not found"}

    if student_obj.password:
        return {"valid": False, "error": "Password already set"}

    student_obj.password = student.password
    db.commit()
    db.refresh(student_obj)

    return {
        "valid": True,
        "student_id": student_obj.student_id,
        "name": student_obj.name,
        "message": "Password set successfully"
    }

# ---------------- ADD + ENROLL STUDENT ----------------
@app.post("/student/add-enroll")
def add_enroll_student(student: schemas.StudentAddIn, db: Session = Depends(get_db)):
    return crud.add_and_enroll_student(
        db,
        student_id=student.student_id,
        name=student.name,
        password=student.password,
        course_id=student.course_id,
        batch_id=student.batch_id
    )

# ---------------- ENROLLMENT ----------------
@app.post("/student/enroll")
def enroll_student(enroll: schemas.EnrollmentIn, db: Session = Depends(get_db)):
    return crud.enroll_student(
        db,
        enroll.student_id,
        enroll.course_id
    )

@app.get("/course/students/{course_id}")
def students_in_course(course_id: int, db: Session = Depends(get_db)):
    return crud.get_students_in_course(db, course_id)

# ---------------- DELETE STUDENT AND ATTENDANCE ----------------
@app.delete("/student/delete")
def delete_student(
    student_id: str = Query(...),
    course_id: int = Query(...),
    db: Session = Depends(get_db)
):
    return crud.delete_student_and_attendance(db, student_id, course_id)

# ---------------- ATTENDANCE ----------------
@app.post("/attendance/mark")
def mark_attendance(att: schemas.AttendanceIn, db: Session = Depends(get_db)):
    return crud.mark_attendance(
        db,
        att.student_id,
        att.course_id,
        att.status,
        att.att_date
    )

@app.get("/attendance/student/{student_id}")
def student_attendance(student_id: str, db: Session = Depends(get_db)):
    records = crud.get_student_attendance(db, student_id)
    return [
        {
            "course_id": r.course_id,
            "status": r.status,
            "att_date": r.date
        }
        for r in records
    ]

@app.get("/attendance/course/{course_id}")
def attendance_by_course_date(
    course_id: int,
    date: str = Query(..., description="YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD"
        )

    return crud.get_attendance_by_course_and_date(
        db,
        course_id,
        date_obj
    )

@app.get("/attendance/course/all/{course_id}")
def get_all_attendance(course_id: int, db: Session = Depends(get_db)):
    return crud.get_all_attendance_for_course(db, course_id)
