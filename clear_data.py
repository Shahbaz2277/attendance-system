from backend.app.database import SessionLocal
from backend.app import models

db = SessionLocal()

db.query(models.Attendance).delete()
db.query(models.Enrollment).delete()
db.query(models.Student).delete()
db.query(models.Course).delete()
db.query(models.Professor).delete()

db.commit()
db.close()

print("✅ All previous data cleared, tables are safe")
