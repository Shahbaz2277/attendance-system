from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from datetime import datetime, date

from . import models

# ---------------- PROFESSOR ----------------
def create_professor(db: Session, prof_id: str, name: str, password: str):
    existing = db.query(models.Professor).filter_by(prof_id=prof_id).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Professor ID already registered. Please login."
        )

    new_prof = models.Professor(
        prof_id=prof_id,
        name=name,
        password=password
    )
    db.add(new_prof)
    db.commit()
    db.refresh(new_prof)
    return new_prof


def login_professor(db: Session, prof_id: str, password: str):
    return db.query(models.Professor).filter_by(
        prof_id=prof_id,
        password=password
    ).first()


# ---------------- COURSE ----------------
def create_course(db: Session, course_name: str, batch_id: int, prof_id: str):
    course = models.Course(
        course_name=course_name,
        batch_id=batch_id,
        prof_id=prof_id
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course_id: int):
    course = db.query(models.Course).filter_by(id=course_id).first()
    if not course:
        return {"deleted": False}

    db.delete(course)
    db.commit()
    return {"deleted": True}


def get_courses_by_batch(db: Session, batch_id: int, prof_id: str):
    return db.query(models.Course).filter_by(
        batch_id=batch_id,
        prof_id=prof_id
    ).all()


# ---------------- STUDENT ----------------
def login_student(db: Session, student_id: str, password: str):
    return db.query(models.Student).filter_by(
        student_id=student_id,
        password=password
    ).first()


def get_student_courses(db: Session, student_id: str):
    return (
        db.query(models.Course)
        .join(models.Enrollment)
        .filter(models.Enrollment.student_id == student_id)
        .all()
    )


def get_student_attendance(db: Session, student_id: str):
    return db.query(models.Attendance).filter_by(
        student_id=student_id
    ).all()


# ---------------- ADD + ENROLL STUDENT ----------------
def add_and_enroll_student(
    db: Session,
    student_id: str,
    name: str,
    password: str,
    course_id: int,
    batch_id: int = None
):
    # Fetch existing student
    student = db.query(models.Student).filter_by(
        student_id=student_id
    ).first()

    if not student:
        course = db.query(models.Course).filter_by(id=course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        if batch_id is None:
            batch_id = course.batch_id

        student = models.Student(
            student_id=student_id,
            name=name,
            password=password,
            batch_id=batch_id
        )
        db.add(student)
        db.commit()
        db.refresh(student)

    # Enroll student if not already enrolled
    enrollment = db.query(models.Enrollment).filter_by(
        student_id=student_id,
        course_id=course_id
    ).first()

    if not enrollment:
        enrollment = models.Enrollment(
            student_id=student_id,
            course_id=course_id
        )
        db.add(enrollment)
        db.commit()

    return {
        "student_id": student.student_id,
        "course_id": course_id
    }


# ---------------- ENROLLMENT ----------------
def enroll_student(db: Session, student_id: str, course_id: int):
    enrollment = db.query(models.Enrollment).filter_by(
        student_id=student_id,
        course_id=course_id
    ).first()

    if enrollment:
        return {"error": "Already enrolled"}

    enroll = models.Enrollment(
        student_id=student_id,
        course_id=course_id
    )
    db.add(enroll)
    db.commit()
    db.refresh(enroll)
    return enroll


def get_students_in_course(db: Session, course_id: int):
    return (
        db.query(models.Student)
        .join(models.Enrollment)
        .filter(models.Enrollment.course_id == course_id)
        .all()
    )


# ---------------- DELETE STUDENT + ATTENDANCE ----------------
def delete_student_and_attendance(db: Session, student_id: str, course_id: int):
    # Delete attendance for this course
    db.query(models.Attendance).filter(
        models.Attendance.student_id == student_id,
        models.Attendance.course_id == course_id
    ).delete(synchronize_session=False)

    # Delete enrollment
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == student_id,
        models.Enrollment.course_id == course_id
    ).first()

    if enrollment:
        db.delete(enrollment)

    db.flush()

    # Check if student has other courses
    remaining = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == student_id
    ).count()

    if remaining == 0:
        student = db.query(models.Student).filter(
            models.Student.student_id == student_id
        ).first()
        if student:
            db.delete(student)

    db.commit()
    return {"deleted": True}


# ---------------- ATTENDANCE ----------------
def mark_attendance(
    db: Session,
    student_id: str,
    course_id: int,
    status: str,
    att_date: date = None
):
    if att_date is None:
        att_date = date.today()
    elif isinstance(att_date, str):
        att_date = datetime.strptime(att_date, "%Y-%m-%d").date()

    attendance = db.query(models.Attendance).filter(
        models.Attendance.student_id == student_id,
        models.Attendance.course_id == course_id,
        func.date(models.Attendance.date) == att_date
    ).first()

    if attendance:
        attendance.status = status
    else:
        attendance = models.Attendance(
            student_id=student_id,
            course_id=course_id,
            status=status,
            date=att_date
        )
        db.add(attendance)

    db.commit()
    db.refresh(attendance)
    return attendance


def get_attendance_by_course_and_date(
    db: Session,
    course_id: int,
    att_date: date = None
):
    if att_date is None:
        att_date = date.today()
    elif isinstance(att_date, str):
        att_date = datetime.strptime(att_date, "%Y-%m-%d").date()

    students = (
        db.query(models.Student)
        .join(models.Enrollment)
        .filter(models.Enrollment.course_id == course_id)
        .all()
    )

    records = db.query(models.Attendance).filter(
        models.Attendance.course_id == course_id,
        func.date(models.Attendance.date) == att_date
    ).all()

    attendance_map = {r.student_id: r.status for r in records}

    result = []
    for s in students:
        result.append({
            "student_id": s.student_id,
            "name": s.name,
            "status": attendance_map.get(s.student_id, "Absent")
        })

    return result


# ---------------- FETCH ALL ATTENDANCE ----------------
def get_all_attendance_for_course(db: Session, course_id: int):
    records = db.query(models.Attendance).filter(
        models.Attendance.course_id == course_id
    ).all()

    result = {}
    for r in records:
        stud_id = r.student_id
        att_date_str = str(r.date)

        if stud_id not in result:
            result[stud_id] = {}

        result[stud_id][att_date_str] = r.status

    return result
def get_student_by_id(db: Session, student_id: str):
    return db.query(models.Student).filter_by(student_id=student_id).first()
