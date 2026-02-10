const API_URL = 'http://localhost:8000/api/auth';

// Show message
function showMessage(message, type = 'error') {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    // Clear previous classes
    messageDiv.className = 'message';
    
    // Set new content and class
    messageDiv.textContent = message;
    messageDiv.classList.add(type);
    messageDiv.style.display = 'block';
    
    console.log('Message displayed:', type, message);
  }
}

// Register User
async function registerUser(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const role = document.getElementById('role').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validation
  if (password !== confirmPassword) {
    showMessage('Passwords do not match!', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters long', 'error');
    return;
  }

  if (!username || !email || !role || !password) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  const registerBtn = document.getElementById('registerBtn');
  registerBtn.disabled = true;
  registerBtn.textContent = 'Registering...';

  try {
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        password_confirm: confirmPassword,
        role: role
      })
    });

    const data = await response.json();
    console.log('Registration response:', response.status, data);

    if (response.ok) {
      // Save token to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      showMessage('Registration successful! Redirecting to dashboard...', 'success');
      
      // Clear the form
      document.getElementById('username').value = '';
      document.getElementById('email').value = '';
      document.getElementById('role').value = '';
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    } else {
      // Handle validation errors
      let errorMessage = '';
      if (data.username) errorMessage += 'Username: ' + data.username[0] + ' ';
      if (data.email) errorMessage += 'Email: ' + data.email[0] + ' ';
      if (data.password) errorMessage += 'Password: ' + data.password[0] + ' ';
      
      showMessage(errorMessage || 'Registration failed', 'error');
      
      // Re-enable button for retry
      registerBtn.disabled = false;
      registerBtn.textContent = 'Register';
    }
  } catch (error) {
    console.error('Registration error:', error);
    showMessage('Connection error. Make sure the server is running at http://localhost:8000', 'error');
    registerBtn.disabled = false;
    registerBtn.textContent = 'Register';
  }
}

// Login User
async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    showMessage('Please fill in all fields', 'error');
    return false;
  }

  const loginBtn = document.getElementById('loginBtn');
  
  // Prevent multiple submissions
  if (loginBtn.disabled) {
    console.log('Button already disabled, preventing duplicate submission');
    return false;
  }
  
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';

  try {
    console.log('Attempting login with email:', email);
    
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    console.log('Response status:', response.status, 'OK:', response.ok);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.status === 200 && data.token) {
      // Save token and user info to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Login successful, token saved');
      showMessage('Login successful! Redirecting...', 'success');
      
      // Clear the form
      document.getElementById('loginEmail').value = '';
      document.getElementById('loginPassword').value = '';
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
      return true;
    } else {
      // Handle error response
      console.log('Login failed with response:', data);
      
      let errorMsg = 'Login failed. Please check your credentials and try again.';
      
      if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
        errorMsg = data.non_field_errors[0];
      } else if (data.email && Array.isArray(data.email)) {
        errorMsg = 'Email: ' + data.email[0];
      } else if (data.password && Array.isArray(data.password)) {
        errorMsg = 'Password: ' + data.password[0];
      } else if (data.detail) {
        errorMsg = data.detail;
      }
      
      showMessage(errorMsg, 'error');
      
      // Re-enable button for retry
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('Connection error. Make sure the server is running at http://localhost:8000', 'error');
    
    // Re-enable button for retry
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
    return false;
  }
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('authToken') !== null;
}

// Get auth header
function getAuthHeader() {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
}

// Logout User
async function logoutUser() {
  try {
    const response = await fetch(`${API_URL}/logout/`, {
      method: 'POST',
      headers: getAuthHeader()
    });

    // Clear localStorage regardless of response
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
}

// Get current user profile
async function getUserProfile() {
  try {
    const response = await fetch(`${API_URL}/profile/`, {
      method: 'GET',
      headers: getAuthHeader()
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Protect pages - redirect to login if not authenticated
function protectPage() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}
