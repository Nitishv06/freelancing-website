# Quick Start Guide - Frontend & Backend Integration

## Prerequisites

- Django server running on `http://localhost:8000`
- Python virtual environment activated
- All required packages installed (Django, DRF, CORS)

---

## Step 1: Start the Django Server

Open a terminal and run:

```bash
cd "c:\freelance appli\freelancing_platform"
"C:/freelance appli/venv/Scripts/python.exe" manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

---

## Step 2: Open Frontend in Browser

Open these files in your browser:

- **Registration**: `file:///c:/freelance%20appli/register.html`
- **Login**: `file:///c:/freelance%20appli/login.html`
- **Dashboard**: `file:///c:/freelance%20appli/dashboard.html` (only after login)

---

## Step 3: Test Registration

1. Go to register.html
2. Fill the form:
   ```
   Username: testuser
   Email: test@example.com
   Role: Freelancer
   Password: Test@123456
   Confirm Password: Test@123456
   ```
3. Click **Register**
4. You should see: "Registration successful! Redirecting to dashboard..."
5. You'll be redirected to dashboard.html

---

## Step 4: Test Dashboard

You should see your profile information:
- Username: testuser
- Email: test@example.com
- Role: Freelancer

Click **Logout** to return to login page.

---

## Step 5: Test Login

1. Go to login.html
2. Fill the form:
   ```
   Email: test@example.com
   Password: Test@123456
   ```
3. Click **Login**
4. You should see: "Login successful! Redirecting..."
5. You'll be redirected to dashboard.html

---

## Troubleshooting

### "Connection error. Make sure the server is running..."

**Solution:**
- Make sure Django server is running on `http://localhost:8000`
- Check if you're getting any errors in the Django terminal
- Check browser console for more details (F12 → Console tab)

### "Invalid credentials"

**Solution:**
- Make sure you're using the correct username and password
- Username is case-sensitive
- Try registering a new user first

### Redirect not working

**Solution:**
- Make sure dashboard.html exists in `c:\freelance appli\` folder
- Check browser console for JavaScript errors (F12 → Console)
- Check localStorage values: (F12 → Application → Local Storage)

### API returns "Page not found"

**Solution:**
- Make sure Django server is running at `http://localhost:8000`
- Try accessing `http://localhost:8000/api/auth/` in browser
- You should see a welcome message with available endpoints

---

## Useful Commands

### Run Django Server
```bash
cd "c:\freelance appli\freelancing_platform"
"C:/freelance appli/venv/Scripts/python.exe" manage.py runserver
```

### Run Django Server on different port (if 8000 is busy)
```bash
"C:/freelance appli/venv/Scripts/python.exe" manage.py runserver 8001
```
Then update API_URL in auth.js to `http://localhost:8001/api/auth`

### Access Django Admin
Open `http://localhost:8000/admin/` and use your superuser credentials

### Create Superuser (if needed)
```bash
"C:/freelance appli/venv/Scripts/python.exe" manage.py createsuperuser
```

### Run Django Checks
```bash
"C:/freelance appli/venv/Scripts/python.exe" manage.py check
```

---

## File Locations

```
c:\freelance appli\
├── login.html              ← Login page
├── register.html           ← Registration page
├── dashboard.html          ← Dashboard (new)
├── auth.js                 ← Authentication functions
├── style.css               ← Styling
├── API_DOCUMENTATION.md    ← Backend API docs
├── FRONTEND_INTEGRATION.md ← Frontend integration guide
└── freelancing_platform\
    ├── manage.py
    ├── db.sqlite3
    └── ...
```

---

## Data Flow

### Registration Flow
```
register.html → registerUser() → POST /api/auth/register/ 
→ Token saved → localStorage → Redirect to dashboard.html
```

### Login Flow
```
login.html → loginUser() → POST /api/auth/login/ 
→ Token saved → localStorage → Redirect to dashboard.html
```

### Dashboard Flow
```
dashboard.html → protectPage() → Check token 
→ If valid: GET /api/auth/profile/ → Display user info
→ If invalid: Redirect to login.html
```

### Logout Flow
```
dashboard.html → logoutUser() → POST /api/auth/logout/ 
→ Token cleared → localStorage cleared → Redirect to login.html
```

---

## Testing Checklist

- [ ] Django server runs without errors
- [ ] Can see welcome message at `http://localhost:8000/api/auth/`
- [ ] Can register a new user
- [ ] Registration saves token to localStorage
- [ ] Dashboard displays user information
- [ ] Can logout successfully
- [ ] Can login with registered credentials
- [ ] Protected pages redirect to login when not authenticated
- [ ] Error messages display correctly for invalid input

---

## Next: API Testing with Postman

If you want to test the API directly with Postman:

1. **Register:**
   - Method: POST
   - URL: http://localhost:8000/api/auth/register/
   - Body (JSON):
   ```json
   {
       "username": "john",
       "email": "john@test.com",
       "password": "Test@123456",
       "password_confirm": "Test@123456",
       "role": "freelancer"
   }
   ```

2. **Login:**
   - Method: POST
   - URL: http://localhost:8000/api/auth/login/
   - Body (JSON):
   ```json
   {
       "email": "john@test.com",
       "password": "Test@123456"
   }
   ```

3. **Get Profile (use token from login response):**
   - Method: GET
   - URL: http://localhost:8000/api/auth/profile/
   - Header: `Authorization: Token <your_token>`

---

## Success Indicators

✅ You'll know everything is working when:
1. Registration page submits and redirects to dashboard
2. Dashboard shows your username and email
3. Logout button works and returns to login
4. Login with credentials works
5. Browser localStorage contains `authToken` and `user` keys
6. Console shows no JavaScript errors
