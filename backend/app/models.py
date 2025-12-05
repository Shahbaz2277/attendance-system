from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Professor(Base):
    __tablename__ = "professors"
    id = Column(Integer, primary_key=True, index=True)
    prof_id = Column(String, unique=True, index=True)
    name = Column(String)
    password = Column(String)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True)
    name = Column(String)
    batch = Column(String)
    password = Column(String)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    batch = Column(String)
    course_name = Column(String)
    professor_id = Column(String, ForeignKey("professors.prof_id"))
    
    professor = relationship("Professor")
