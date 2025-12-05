from sqlalchemy.orm import Session
from . import models

# ---------------- Professor ----------------
def register_professor(db: Session, prof_id: str, name: str, password: str):
    if db.query(models.Professor).filter(models.Professor.prof_id == prof_id).first():
        return None
    db_prof = models.Professor(prof_id=prof_id, name=name, password=password)
    db.add(db_prof)
    db.commit()
    db.refresh(db_prof)
    return db_prof

def login_professor(db: Session, prof_id: str, password: str):
    return db.query(models.Professor).filter(models.Professor.prof_id==prof_id, models.Professor.password==password).first()

# ---------------- Student ----------------
def register_student(db: Session, student_id: str, name: str, batch: str, password: str):
    if db.query(models.Student).filter(models.Student.student_id == student_id).first():
        return None
    db_student = models.Student(student_id=student_id, name=name, batch=batch, password=password)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def login_student(db: Session, student_id: str, password: str):
    return db.query(models.Student).filter(models.Student.student_id==student_id, models.Student.password==password).first()

# ---------------- Course ----------------
def add_course(db: Session, batch: str, course_name: str, professor_id: str):
    db_course = models.Course(batch=batch, course_name=course_name, professor_id=professor_id)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def get_courses_by_batch(db: Session, batch: str):
    return db.query(models.Course).filter(models.Course.batch==batch).all()
