from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Attendance Backend")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- Professor Endpoints ----------------
@app.post("/professor/register")
def professor_register(payload: schemas.ProfessorRegister, db: Session = Depends(get_db)):
    prof = crud.register_professor(db, payload.prof_id, payload.name, payload.password)
    if not prof:
        raise HTTPException(status_code=400, detail="ID already registered")
    return {"message": f"Professor {prof.name} registered successfully."}

@app.post("/professor/login")
def professor_login(payload: schemas.ProfessorLogin, db: Session = Depends(get_db)):
    prof = crud.login_professor(db, payload.prof_id, payload.password)
    if not prof:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    # Return available batches for professor
    batches = ["22", "23", "24", "25"]
    return {"message": f"Professor {prof.name} logged in successfully.", "batches": batches}

# ---------------- Student Endpoints ----------------
@app.post("/student/register")
def student_register(payload: schemas.StudentRegister, db: Session = Depends(get_db)):
    student = crud.register_student(db, payload.student_id, payload.name, payload.batch, payload.password)
    if not student:
        raise HTTPException(status_code=400, detail="ID already registered")
    return {"message": f"Student {student.name} registered successfully."}

@app.post("/student/login")
def student_login(payload: schemas.StudentLogin, db: Session = Depends(get_db)):
    student = crud.login_student(db, payload.student_id, payload.password)
    if not student:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": f"Student {student.name} logged in successfully."}

# ---------------- Course Endpoints ----------------
@app.post("/professor/add_course")
def add_course(payload: schemas.CourseCreate, prof_id: str, db: Session = Depends(get_db)):
    course = crud.add_course(db, payload.batch, payload.course_name, prof_id)
    return {"message": f"Course '{course.course_name}' added to Batch {course.batch}."}

@app.get("/courses/{batch}")
def get_courses(batch: str, db: Session = Depends(get_db)):
    courses = crud.get_courses_by_batch(db, batch)
    return {"batch": batch, "courses": [c.course_name for c in courses]}
