import requests

BASE_URL = "http://127.0.0.1:8000"

def print_response(title, r):
    print("\n" + "="*50)
    print(title)
    print("Status Code:", r.status_code)
    try:
        print("Response:", r.json())
    except:
        print("Response:", r.text)

# ---------------- HOME ----------------
r = requests.get(f"{BASE_URL}/")
print_response("HOME", r)

# ---------------- PROFESSOR REGISTER ----------------
r = requests.post(
    f"{BASE_URL}/professor/register",
    json={
        "prof_id": "PROF001",
        "name": "Ali",
        "password": "123"
    }
)
print_response("PROFESSOR REGISTER", r)

# ---------------- PROFESSOR LOGIN ----------------
r = requests.post(
    f"{BASE_URL}/professor/login",
    json={
        "prof_id": "PROF001",
        "password": "123"
    }
)
print_response("PROFESSOR LOGIN", r)

# ---------------- ADD COURSE ----------------
r = requests.post(
    f"{BASE_URL}/course/add",
    json={
        "course_name": "AI",
        "batch_id": 22,
        "prof_id": "PROF001"
    }
)
print_response("ADD COURSE", r)

course_id = r.json().get("id", 1)

# ---------------- ADD + ENROLL STUDENT ----------------
r = requests.post(
    f"{BASE_URL}/student/add-enroll",
    json={
        "student_id": "STU001",
        "name": "Ahmed",
        "password": "123",
        "course_id": course_id
    }
)
print_response("ADD + ENROLL STUDENT", r)

# ---------------- STUDENT LOGIN ----------------
r = requests.post(
    f"{BASE_URL}/student/login",
    json={
        "student_id": "STU001",
        "password": "123"
    }
)
print_response("STUDENT LOGIN", r)

# ---------------- GET COURSES BY BATCH ----------------
r = requests.get(f"{BASE_URL}/courses/22/PROF001")
print_response("GET COURSES BY BATCH", r)

# ---------------- GET STUDENTS IN COURSE ----------------
r = requests.get(f"{BASE_URL}/course/students/{course_id}")
print_response("STUDENTS IN COURSE", r)

# ---------------- MARK ATTENDANCE ----------------
r = requests.post(
    f"{BASE_URL}/attendance/mark",
    json={
        "student_id": "STU001",
        "course_id": course_id,
        "status": "Present"
    }
)
print_response("MARK ATTENDANCE", r)

# ---------------- STUDENT ATTENDANCE ----------------
r = requests.get(f"{BASE_URL}/attendance/student/STU001")
print_response("STUDENT ATTENDANCE", r)

# ---------------- DELETE COURSE ----------------
r = requests.delete(
    f"{BASE_URL}/course/delete",
    json={"course_id": course_id}
)
print_response("DELETE COURSE", r)
