// login.js - Client-side script for handling login functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check if login module is already initialized to prevent duplicate initialization
  if (window.loginInitialized) return;
  window.loginInitialized = true;
  
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
            if (loginModal) {
              loginModal.hide();
            }
            
            // Check if we need to resume to a previous action after login
            const pendingAction = sessionStorage.getItem('pendingAfterLoginAction');
            if (pendingAction) {
              try {
                const actionData = JSON.parse(pendingAction);
                if (actionData.type === 'openCard' && actionData.cardId) {
                  // Find the card and trigger click
                  const cardData = window.cardData ? window.cardData.find(card => card.id === actionData.cardId) : null;
                  if (cardData && typeof window.openCardModal === 'function') {
                    window.openCardModal(cardData);
                  }
                }
              } catch (e) {
                console.error('Failed to process pending action:', e);
              }
              sessionStorage.removeItem('pendingAfterLoginAction');
            }
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
  
  // Set up logout button event if it exists outside the dropdown
  const globalLogoutBtn = document.getElementById('global-logout-btn');
  if (globalLogoutBtn && !globalLogoutBtn.hasLogoutListener) {
    globalLogoutBtn.hasLogoutListener = true;
    globalLogoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
  
  // Check if user is already logged in on page load
  checkLoginStatus();
  
  // Make sure card_title.js functions are accessible
  if (typeof window.openCardModal !== 'function') {
    window.openCardModal = function(data) {
      // If card_title.js hasn't loaded yet, try to define a fallback
      if (window.currentCardData === undefined) {
        window.currentCardData = null;
      }
      window.currentCardData = data;
      
      // Lấy các phần tử modal
      const modal = document.getElementById('card');
      if (!modal) {
        console.error('Không tìm thấy modal card!');
        return;
      }
      
      const modalTitle = modal.querySelector('.modal-title');
      const modalBody = modal.querySelector('.modal-body');
      
      // Đặt tiêu đề modal là tiêu đề card
      if (modalTitle) modalTitle.textContent = data.title;
      
      // Cập nhật hình ảnh và thông tin trong card bên trong modal
      const cardImg = modalBody ? (modalBody.querySelector('.img-fluid') || modalBody.querySelector('.card img')) : null;
      if (cardImg) {
        cardImg.src = data.image;
        cardImg.alt = data.title;
      }
      
      // Cập nhật tiêu đề và nội dung trong card
      const cardTitle = modalBody ? modalBody.querySelector('.card-title') : null;
      if (cardTitle) {
        cardTitle.textContent = data.title;
      }
      
      // Tìm và cập nhật các phần tử card-text
      const cardTexts = modalBody ? modalBody.querySelectorAll('.card-text') : [];
      if (cardTexts.length > 0) {
        cardTexts[0].textContent = data.content; // Tác giả hoặc nội dung chính
        
        // Các thông tin khác nếu có
        if (cardTexts.length > 1) {
          cardTexts[1].textContent = "Thể loại: Truyện tranh";
        }
        if (cardTexts.length > 2) {
          cardTexts[2].textContent = `Nội dung truyện: ${data.content}`;
        }
      }
      
      // Mở modal sử dụng Bootstrap
      if (typeof bootstrap !== 'undefined') {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
      } else {
        console.error('Bootstrap không được tìm thấy!');
      }
    };
  }
});

// Chức năng kiểm tra và xử lý quyền truy cập nội dung
function checkAccessRights(contentType, contentId) {
  // Kiểm tra người dùng đã đăng nhập hay chưa
  const isLoggedIn = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
  
  // Danh sách nội dung công khai, cho phép truy cập mà không cần đăng nhập
  const publicContent = true; // Mặc định tất cả nội dung đều công khai
  
  // Nếu nội dung công khai hoặc đã đăng nhập, cho phép truy cập
  if (publicContent || isLoggedIn) {
    return true;
  }
  
  // Lưu hành động đang thực hiện để sau khi đăng nhập có thể tiếp tục
  sessionStorage.setItem('pendingAfterLoginAction', JSON.stringify({
    type: contentType,
    cardId: contentId
  }));
  
  // Hiển thị modal đăng nhập
  if (typeof bootstrap !== 'undefined') {
    const loginModal = document.getElementById('login');
    if (loginModal) {
      const bsLoginModal = new bootstrap.Modal(loginModal);
      bsLoginModal.show();
    }
  }
  
  return false;
}

function showLoginMessage(message, type) {
  const loginForm = document.querySelector('#login .modal-body');
  
  if (!loginForm) return;
  
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
    if (alertElement.parentNode === loginForm) {
      alertElement.remove();
    }
  }, 3000);
}

function updateUIAfterLogin(username) {
  // Update the login/register button to show username
  const userDropdown = document.querySelector('.nav-item.dropdown .nav-link.dropdown-toggle');
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
    if (logoutBtn && !logoutBtn.hasLogoutListener) {
      logoutBtn.hasLogoutListener = true;
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
  
  // Apply current theme if the function exists
  if (typeof applyCurrentTheme === 'function') {
    applyCurrentTheme();
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

// Expose functions that might be needed by other scripts
window.loginFunctions = {
  checkLoginStatus,
  logout,
  updateUIAfterLogin,
  checkAccessRights  // Thêm hàm kiểm tra quyền truy cập
};