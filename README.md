# 🎓 Department Attendance Management System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

A comprehensive **Full-Stack Attendance Management System** designed for educational institutions. This application facilitates seamless interaction between professors and students, allowing for efficient course management, student enrollment, and attendance tracking.

---

## 🌐 Live Demo

Try out the application live:

| Component | URL |
| :--- | :--- |
| **Frontend UI** | [attendance-system-2-fezd.onrender.com](https://attendance-system-2-fezd.onrender.com) |
| **Backend API** | [attendance-system-1-rg9y.onrender.com](https://attendance-system-1-rg9y.onrender.com) |

> **Note:** The backend is hosted on a free instance, so it may take a minute to spin up on the first request.

---

---

## 🚀 Features

### 👨‍🏫 For Professors
*   **Secure Authentication**: Register and login securely.
*   **Course Management**: Create and manage courses for different batches.
*   **Attendance Tracking**: Mark daily attendance (Present/Absent) for enrolled students.
*   **Records View**: View historical attendance records by course and date.

### 👨‍🎓 For Students
*   **Easy Access**: Student login with password management (set password on first login).
*   **Course Enrollment**: View enrolled courses and batch details.
*   **Track Progress**: Check personal attendance records.

### ⚙️ System Highlights
*   **Role-Based Access Control**: Distinct features for Professors and Students.
*   **Batch Management**: Organize students and courses by academic batches.
*   **RESTful API**: Robust backend API built with FastAPI.
*   **Modern UI**: Responsive frontend built with React.

---

## 🛠️ Tech Stack

### Backend
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance async web framework)
*   **Language**: Python 3.10+
*   **Database**: SQLite (Default) / PostgreSQL (Supported)
*   **ORM**: SQLAlchemy
*   **Authentication**: JWT (JSON Web Tokens) with `passlib` & `bcrypt`

### Frontend
*   **Framework**: React (v19)
*   **Routing**: React Router
*   **HTTP Client**: Axios
*   **Styling**: CSS Modules / Standard CSS

---

## 📂 Project Structure

```bash
attendance-system/
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── main.py           # App entry point & endpoint definitions
│   │   ├── models.py         # SQLAlchemy Database models
│   │   ├── schemas.py        # Pydantic schemas (Request/Response)
│   │   ├── crud.py           # Database CRUD operations
│   │   ├── auth.py           # Authentication & JWT logic
│   │   └── database.py       # DB connection & session handling
│   ├── init_db.py            # Script to initialize DB & seed professors
│   ├── test_all_apis.py      # Backend API testing script
│   └── attendance.db         # SQLite Database file
├── frontend/                 # React Frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── pages/            # Application Pages
│   │   │   ├── Home.js              # Landing page
│   │   │   ├── ProfessorAuth.js     # Professor Login/Register
│   │   │   ├── ProfessorDashboard.js# Prof Dashboard (manage batches)
│   │   │   ├── BatchSelect.js       # Select batch to manage
│   │   │   ├── CourseAdd.js         # Add new course
│   │   │   ├── StudentAdd.js        # Add/Enroll students
│   │   │   ├── AttendanceMark.js    # Mark daily attendance
│   │   │   ├── CourseAttendance.js  # View attendance history
│   │   │   ├── StudentLogin.js      # Student Login
│   │   │   └── StudentDashboard.js  # Student Dashboard
│   │   ├── api.js            # Axios configuration & API calls
│   │   ├── App.js            # Main Route definitions
│   │   └── index.js          # React entry point
│   └── package.json          # Frontend dependencies & scripts
├── requirements.txt          # Python/Backend dependencies
└── README.md                 # Project Documentation
```

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   **Python 3.10+** installed.
*   **Node.js** and **npm** installed.

### 1️⃣ Backend Setup

Open a terminal in the project root:

1.  **Create and activate a virtual environment**:
    ```powershell
    # Windows PowerShell
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Initialize the Database**:
    This script creates the necessary tables and seeds initial data (if configured).
    ```bash
    python backend/init_db.py
    ```

4.  **Run the Server**:
    Start the FastAPI development server.
    ```bash
    uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
    ```
    ✅ **Server running at**: `http://127.0.0.1:8000`  
    📄 **API Docs**: `http://127.0.0.1:8000/docs`

### 2️⃣ Frontend Setup

Open a new terminal and navigate to the `frontend` folder:

1.  **Install dependencies**:
    ```bash
    cd frontend
    npm install
    ```

2.  **Configure API URL** (Optional):
    If your backend runs on a different port, update `frontend/src/api.js`:
    ```javascript
    export const BASE_URL = "http://127.0.0.1:8000";
    ```

3.  **Start the React App**:
    ```bash
    npm start
    ```
    ✅ **App running at**: `http://localhost:3000`

---

## 🔌 API Reference

The backend provides auto-generated documentation via Swagger UI. Once the backend is running, visit:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

### Key Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/professor/register` | Register a new professor |
| **POST** | `/professor/login` | Professor login |
| **POST** | `/course/add` | Create a new course |
| **POST** | `/attendance/mark` | Mark student attendance |
| **GET** | `/attendance/course/{id}` | Get course attendance records |
| **POST** | `/student/login` | Student login |

---

## 🤝 Contributing

Contributions are welcome!

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📝 License

This project is currently unlicensed. Feel free to use it for educational purposes.
