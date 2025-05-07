Budget Tracker - Backend

This is the backend for the Budget Tracker application, built using Django and Django REST Framework. It exposes a secure RESTful API for user authentication, transaction tracking, budgeting, and category management.

## 🔧 Tech Stack

- Django
- Django REST Framework (DRF)
- PostgreSQL
- JWT Authentication (via `djangorestframework-simplejwt`)
- CORS Headers

Installation

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Run the Server
python manage.py runserver

Authentication
Uses JWT tokens via SimpleJWT.

Login endpoint: /api/token/

Refresh endpoint: /api/token/refresh/
