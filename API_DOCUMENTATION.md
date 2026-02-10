# Freelancing Platform API Documentation

## Base URL
```
http://localhost:8000/api/auth/
```

## Authentication
The API uses **Token Authentication**. After login/register, include the token in the `Authorization` header:
```
Authorization: Token your_token_here
```

---

## Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register/`

**Description:** Create a new user account

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "role": "freelancer"
}
```

**Valid roles:** `freelancer`, `recruiter`

**Response (201 Created):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "freelancer"
    },
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

**Error Response (400 Bad Request):**
```json
{
    "username": ["Username already exists."],
    "email": ["Email already exists."],
    "password": ["Passwords do not match."]
}
```

---

### 2. Login User
**Endpoint:** `POST /api/auth/login/`

**Description:** Authenticate user and get access token

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "freelancer"
    },
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

**Error Response (400 Bad Request):**
```json
{
    "non_field_errors": ["Invalid email or password."]
}
```

---

### 3. Get User Profile
**Endpoint:** `GET /api/auth/profile/`

**Description:** Retrieve current logged-in user's profile

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "freelancer",
    "first_name": "",
    "last_name": ""
}
```

**Error Response (401 Unauthorized):**
```json
{
    "detail": "Authentication credentials were not provided."
}
```

---

### 4. Logout User
**Endpoint:** `POST /api/auth/logout/`

**Description:** Logout user and invalidate token

**Headers Required:**
```
Authorization: Token your_token_here
```

**Response (200 OK):**
```json
{
    "message": "Logout successful"
}
```

---

## Testing with cURL

### Register a new user:
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "role": "freelancer"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Get Profile (replace TOKEN with actual token):
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Token TOKEN"
```

### Logout:
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Token TOKEN"
```

---

## Testing with Postman

1. **Register Endpoint:**
   - Method: `POST`
   - URL: `http://localhost:8000/api/auth/register/`
   - Body (JSON):
     ```json
     {
         "username": "john_doe",
         "email": "john@example.com",
         "password": "securepassword123",
         "password_confirm": "securepassword123",
         "role": "freelancer"
     }
     ```

2. **Login Endpoint:**
   - Method: `POST`
   - URL: `http://localhost:8000/api/auth/login/`
   - Body (JSON):
     ```json
     {
         "email": "john@example.com",
         "password": "securepassword123"
     }
     ```

3. **Profile Endpoint (Authenticated):**
   - Method: `GET`
   - URL: `http://localhost:8000/api/auth/profile/`
   - Headers: Add `Authorization: Token <your_token_here>`

---

## Features Implemented

✅ **User Registration**
- Username and email validation
- Password confirmation
- Role selection (Freelancer/Recruiter)
- Automatic token generation on registration

✅ **User Login**
- Credentials validation
- Token-based authentication
- User profile returned with token

✅ **User Profile**
- Retrieve authenticated user's information
- Protected endpoint (requires token)

✅ **Logout**
- Token invalidation
- Protected endpoint (requires token)

✅ **Security**
- Token-based authentication
- Password hashing
- CORS enabled for frontend integration
- Proper error handling and validation

---

## Running the Development Server

```bash
cd c:\freelance appli\freelancing_platform
..\venv\Scripts\python.exe manage.py runserver
```

Server will be available at: `http://localhost:8000/`

---

## Frontend Integration

To use these APIs from your frontend (HTML/JS), here's an example:

```javascript
// Register
async function register() {
    const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'john_doe',
            email: 'john@example.com',
            password: 'securepassword123',
            password_confirm: 'securepassword123',
            role: 'freelancer'
        })
    });
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
}

// Login
async function login() {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'john@example.com',
            password: 'securepassword123'
        })
    });
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
}

// Get Profile
async function getProfile() {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
    });
    return await response.json();
}

// Logout
async function logout() {
    const token = localStorage.getItem('authToken');
    await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`
        }
    });
    localStorage.removeItem('authToken');
}
```
