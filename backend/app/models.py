from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from .database import Base

# ---------------- PROFESSOR ----------------
class Professor(Base):
    __tablename__ = "professors"
    prof_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)

    # Relationship: A professor can have many courses
    courses = relationship(
        "Course",
        back_populates="professor",
        cascade="all, delete-orphan"
    )


# ---------------- BATCH ----------------
class Batch(Base):
    __tablename__ = "batches"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)

    # Relationships
    courses = relationship(
        "Course",
        back_populates="batch",
        cascade="all, delete-orphan"
    )
    students = relationship(
        "Student",
        back_populates="batch",
        cascade="all, delete-orphan"
    )


# ---------------- COURSE ----------------
class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    course_name = Column(String, nullable=False)
    batch_id = Column(Integer, ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    prof_id = Column(String, ForeignKey("professors.prof_id", ondelete="CASCADE"), nullable=False)

    # Relationships
    batch = relationship("Batch", back_populates="courses")
    professor = relationship("Professor", back_populates="courses")
    
    enrollments = relationship(
        "Enrollment",
        back_populates="course",
        cascade="all, delete-orphan"
    )
    attendance = relationship(
        "Attendance",
        back_populates="course",
        cascade="all, delete-orphan"
    )


# ---------------- STUDENT ----------------
class Student(Base):
    __tablename__ = "students"
    student_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    batch_id = Column(Integer, ForeignKey("batches.id", ondelete="CASCADE"), nullable=True)

    # Relationships
    batch = relationship("Batch", back_populates="students")
    enrollments = relationship(
        "Enrollment",
        back_populates="student",
        cascade="all, delete-orphan"
    )
    attendance = relationship(
        "Attendance",
        back_populates="student",
        cascade="all, delete-orphan"
    )


# ---------------- ENROLLMENT ----------------
class Enrollment(Base):
    __tablename__ = "enrollments"
    # Composite Primary Key ensures a student cannot enroll in the same course twice
    student_id = Column(String, ForeignKey("students.student_id", ondelete="CASCADE"), primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


# ---------------- ATTENDANCE ----------------
class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, nullable=False) # e.g., "Present", "Absent"
    date = Column(Date, nullable=False)

    # Relationships
    student = relationship("Student", back_populates="attendance")
    course = relationship("Course", back_populates="attendance")