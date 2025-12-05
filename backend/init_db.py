from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Professor

professors_list = [
    ("PROF001", "Dr. Shahbaz Ahmad Niazi"),
    ("PROF002", "Dr. Muhammad Amjad"),
    ("PROF003", "Dr. Rizwan Anjum"),
    ("PROF004", "Dr. Abbas Abbasi"),
    ("PROF005", "Dr. Abid Munir"),
    ("PROF006", "Dr. Dileep Kumar"),
    ("PROF007", "Dr. Abid Javed"),
    ("PROF008", "Dr. Waqas Anjum"),
    ("PROF009", "Dr. Fasi-ur-Rehman"),
    ("PROF010", "Engr. Talha Gohar"),
    ("PROF011", "Engr. Shehryar Paracha"),
    ("PROF012", "Engr. Muhammad Shafiq"),
    ("PROF013", "Engr. Rameez Bukhari"),
]

def init_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    for pid, name in professors_list:
        if not db.query(Professor).filter_by(id=pid).first():
            prof = Professor(id=pid, name=name)
            db.add(prof)
    db.commit()
    db.close()
    print("Database initialized!")

if __name__ == "__main__":
    init_db()
