// login.js - Client-side script for handling login functionality

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#login form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('exampleInputEmail1').value;
        const password = document.getElementById('exampleInputPassword1').value;
        const rememberMe = document.getElementById('exampleCheck1').checked;
        
        // Validate input
        if (!email || !password) {
          showLoginMessage('Vui lòng nhập đầy đủ thông tin đăng nhập', 'danger');
          return;
        }
        
        // Send login request to server
        fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            rememberMe
          }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            // Store user session info in localStorage or sessionStorage
            if (rememberMe) {
              localStorage.setItem('userToken', data.token);
              localStorage.setItem('userName', data.username);
            } else {
              sessionStorage.setItem('userToken', data.token);
              sessionStorage.setItem('userName', data.username);
            }
            
            // Show success message
            showLoginMessage('Đăng nhập thành công!', 'success');
            
            // Update UI to show logged in state
            updateUIAfterLogin(data.username);
            
            // Close modal after success
            setTimeout(() => {
              const loginModal = bootstrap.Modal.getInstance(document.getElementById('login'));
              loginModal.hide();
            }, 1500);
          } else {
            showLoginMessage(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', 'danger');
          }
        })
        .catch(error => {
          showLoginMessage('Lỗi kết nối: ' + error.message, 'danger');
        });
      });
    }
    
    // Check if user is already logged in on page load
    checkLoginStatus();
  });
  
  function showLoginMessage(message, type) {
    const loginForm = document.querySelector('#login .modal-body');
    
    // Remove any existing alerts
    const existingAlert = loginForm.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} mt-3`;
    alertElement.role = 'alert';
    alertElement.textContent = message;
    
    // Add alert to form
    loginForm.appendChild(alertElement);
    
    // Auto-remove alert after 3 seconds
    setTimeout(() => {
      alertElement.remove();
    }, 3000);
  }
  
  function updateUIAfterLogin(username) {
    // Update the login/register button to show username
    const userDropdown = document.querySelector('.nav-link.dropdown-toggle');
    if (userDropdown) {
      userDropdown.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
      </svg> ${username}`;
    }
    
    // Update dropdown menu options for logged in user
    const dropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="#">Thông tin tài khoản</a></li>
        <li><a class="dropdown-item" href="#">Truyện đã đọc</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" id="logout-btn">Đăng xuất</a></li>
      `;
      
      // Add logout functionality
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          logout();
        });
      }
    }
    
    // Update history modal if present
    const historyModal = document.querySelector('#history .modal-body');
    if (historyModal) {
      // Replace "please login" message with actual history content
      historyModal.innerHTML = `
        <h2>Lịch sử xem truyện của bạn</h2>
        <div class="row mt-4" id="history-items">
          <p>Chưa có lịch sử xem truyện.</p>
        </div>
      `;
      
      // Here you would fetch and display actual history
      // fetchUserHistory();
    }
  }
  
  function checkLoginStatus() {
    // Check if user is logged in from localStorage or sessionStorage
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    const username = localStorage.getItem('userName') || sessionStorage.getItem('userName');
    
    if (token && username) {
      // Verify token with server
      fetch('/api/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          updateUIAfterLogin(username);
        } else {
          // Token invalid, clear storage
          logout(false);
        }
      })
      .catch(() => {
        // Network error, but we'll still show as logged in client-side
        updateUIAfterLogin(username);
      });
    }
  }
  
  function logout(sendRequest = true) {
    if (sendRequest) {
      // Send logout request to server
      const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
      
      fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => {
        // Even if server request fails, we'll still log out client-side
      });
    }
    
    // Clear user data from storage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userName');
    
    // Reset UI to logged out state
    location.reload();
  }