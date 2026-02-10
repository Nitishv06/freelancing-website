# Frontend Integration Guide

## Overview

The frontend has been fully integrated with the Django backend API using token-based authentication. The application now communicates with the Django REST API instead of using localStorage.

## Files Updated

### 1. **login.html**
- Removed role selection (role is determined by the API)
- Changed username field to email field for login
- Added message display div for feedback
- Form now calls `loginUser()` function from auth.js

### 2. **register.html**
- Added username field for registration
- Kept email, role, and password fields
- Added message display div for feedback
- Form now calls `registerUser()` function from auth.js

### 3. **auth.js** (Completely Updated)
- Replaced localStorage-based authentication with API calls
- Added functions:
  - `registerUser()` - POST to `/api/auth/register/`
  - `loginUser()` - POST to `/api/auth/login/`
  - `logoutUser()` - POST to `/api/auth/logout/`
  - `getUserProfile()` - GET from `/api/auth/profile/`
  - `isLoggedIn()` - Check if user has token
  - `getAuthHeader()` - Get Authorization header with token
  - `protectPage()` - Redirect to login if not authenticated
  - `showMessage()` - Display error/success messages

### 4. **style.css** (Enhanced)
- Added styles for message alerts (error/success)
- Added button disabled state styling
- Added border-radius to inputs and buttons
- Added box-sizing for proper alignment

### 5. **dashboard.html** (New)
- Created a user dashboard to display profile information
- Protected page - only accessible if logged in
- Displays username, email, and role
- Includes logout button
- Automatically loads user profile from API

---

## How It Works

### Registration Flow

1. User fills in register.html form with:
   - Username
   - Email
   - Role (Freelancer/Recruiter)
   - Password (min 6 characters)
   - Confirm Password

2. JavaScript validates:
   - Passwords match
   - Password length >= 6 characters
   - All fields filled

3. API call to `POST http://localhost:8000/api/auth/register/`

4. If successful:
   - Token saved to localStorage
   - User info saved to localStorage
   - Success message shown
   - Redirected to dashboard.html (after 2 seconds)

5. If failed:
   - Error messages displayed from API
   - No redirect

### Login Flow

1. User fills in login.html form with:
   - Email
   - Password

2. API call to `POST http://localhost:8000/api/auth/login/`

3. If successful:
   - Token saved to localStorage
   - User info saved to localStorage
   - Success message shown
   - Redirected to dashboard.html (after 2 seconds)

4. If failed:
   - Error message "Invalid email or password" displayed

### Dashboard Flow

1. When dashboard.html loads:
   - `protectPage()` checks if user is logged in
   - If not logged in, redirect to login.html
   - If logged in, `loadProfile()` fetches user data from API

2. User profile information displayed:
   - Username
   - Email
   - Role

3. User can click Logout button:
   - Token is invalidated on server
   - localStorage cleared
   - Redirected to login.html

---

## Testing Steps

### 1. Start the Django Server
```bash
cd "c:\freelance appli\freelancing_platform"
"C:/freelance appli/venv/Scripts/python.exe" manage.py runserver
```

The server should be running at `http://localhost:8000`

### 2. Open Frontend Files in Browser

#### Test Registration:
1. Open `file:///c:/freelance%20appli/register.html` in browser
2. Fill in form:
   - Username: `john_doe`
   - Email: `john@example.com`
   - Role: `Freelancer`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click Register
4. Should see success message and redirect to dashboard

#### Test Login:
1. If not on dashboard, open `file:///c:/freelance%20appli/login.html`
2. Fill in form:
   - Username: `john_doe`
   - Password: `password123`
3. Click Login
4. Should see success message and redirect to dashboard

#### Test Dashboard:
1. After login/register, should see user profile with:
   - Username: john_doe
   - Email: john@example.com
   - Role: Freelancer
2. Click Logout button to logout

#### Test Protected Page:
1. Logout and clear browser localStorage
2. Try to open `file:///c:/freelance%20appli/dashboard.html`
3. Should automatically redirect to login.html

---

## Local Storage

The application now stores:

```javascript
// Authentication token
localStorage.getItem('authToken')
// Returns: "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"

// User information
localStorage.getItem('user')
// Returns: {"id": 1, "username": "john_doe", "email": "john@example.com", "role": "freelancer"}
```

---

## Error Handling

The application handles:

1. **Network Errors** - "Connection error. Make sure the server is running..."
2. **Validation Errors** - Specific field errors from API (username exists, email exists, passwords don't match)
3. **Authentication Errors** - "Invalid credentials" for wrong username/password
4. **Token Expiry** - Automatic redirect to login if token is invalid

---

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register/` | Create new account |
| POST | `/api/auth/login/` | Login and get token |
| GET | `/api/auth/profile/` | Get user profile (protected) |
| POST | `/api/auth/logout/` | Logout and invalidate token |

---

## Important Notes

- The API URL is set to `http://localhost:8000/api/auth` in auth.js
- Make sure Django server is running on port 8000
- CORS is enabled in Django settings for frontend integration
- Tokens are stored in localStorage (not secure for production - use HttpOnly cookies)
- The frontend expects the dashboard.html file to exist for redirects
- All forms show loading state ("Registering...", "Logging in...") during API calls

---

## Next Steps

For production deployment:
1. Deploy Django backend to a proper server
2. Update `API_URL` in auth.js to point to production API
3. Use HttpOnly cookies instead of localStorage for tokens
4. Add HTTPS certificate
5. Update ALLOWED_HOSTS in Django settings
6. Set DEBUG = False in Django settings
7. Use environment variables for sensitive data
