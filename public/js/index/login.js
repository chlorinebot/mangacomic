document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  // Check if user is already logged in
  checkLoginStatus();

  if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          const username = document.getElementById('loginUsername').value;
          const password = document.getElementById('loginPassword').value;

          try {
              const response = await fetch('https://truyencuatuan.up.railway.app/api/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, password }),
              });

              const data = await response.json();

              if (response.ok) {
                  loginMessage.textContent = data.message;
                  loginMessage.className = 'mt-2 text-success';

                  // Lưu token và role_id vào localStorage
                  const token = data.token;
                  const roleId = data.role_id;
                  localStorage.setItem('token', token);
                  localStorage.setItem('username', username);
                  localStorage.setItem('roleId', roleId);

                  // Giải mã token (sử dụng CDN)
                  const decodedToken = jwt_decode(token); // Sử dụng jwt_decode từ CDN
                  console.log('Decoded token:', decodedToken);

                  // Update the UI ngay lập tức
                  updateNavbarForLoggedInUser(username);

                  // Kiểm tra role và chuyển hướng
                  if (roleId === 1) {
                      setTimeout(() => {
                          window.location.href = '/admin-web'; // Chuyển hướng tới admin-web cho admin
                      }, 1000);
                  } else {
                      // Đóng modal cho người dùng thường (role_id = 2)
                      setTimeout(() => {
                          const modal = bootstrap.Modal.getInstance(document.getElementById('login'));
                          if (modal) modal.hide();
                      }, 1000);
                  }

                  // Kiểm tra lại trạng thái đăng nhập sau khi cập nhật
                  checkLoginStatus();
              } else {
                  loginMessage.textContent = data.error || 'Đăng nhập thất bại!';
                  loginMessage.className = 'mt-2 text-danger';
              }
          } catch (error) {
              loginMessage.textContent = `Lỗi kết nối server: ${error.message}`;
              loginMessage.className = 'mt-2 text-danger';
              console.error('Lỗi chi tiết:', error);
          }
      });
  }

  // Add event listener for logout button
  document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'logoutButton') {
          logout();
      }
  });
});

// Function to check if user is already logged in
function checkLoginStatus() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const roleId = localStorage.getItem('roleId');

  if (token && username) {
      updateNavbarForLoggedInUser(username);
      // Nếu đã đăng nhập và là admin, tự động chuyển hướng từ index
      if (roleId === '1' && window.location.pathname === '/') {
          window.location.href = '/admin-web';
      }
  } else {
      // Nếu không có token, reset navbar
      const userDropdown = document.querySelector('.nav-item.dropdown.ms-5');
      if (userDropdown) {
          userDropdown.innerHTML = `
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                  </svg>
                  Đăng nhập/Đăng ký
              </a>
              <ul class="dropdown-menu">
                  <button type="button" class="btn btn-success ms-5" data-bs-toggle="modal" data-bs-target="#login">Đăng nhập</button>
                  <li><hr class="dropdown-divider"></li>
                  <button type="button" class="btn btn-outline-success ms-5" data-bs-toggle="modal" data-bs-target="#logup" style="width: 105px;">Đăng ký</button>
              </ul>
          `;
      }
  }
}

// Function to update navbar for logged-in user
function updateNavbarForLoggedInUser(username) {
  const userDropdown = document.querySelector('.nav-item.dropdown.ms-5');

  if (userDropdown) {
      userDropdown.innerHTML = `
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
              ${username}
          </a>
          <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Thông tin tài khoản</a></li>
              <li><a class="dropdown-item" href="#">Cài đặt</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><button id="logoutButton" class="dropdown-item text-danger">Đăng xuất</button></li>
          </ul>
      `;

      // Cập nhật modal lịch sử nếu tồn tại
      const historyModal = document.getElementById('history');
      if (historyModal) {
          const loginMessage = historyModal.querySelector('h1');
          if (loginMessage && loginMessage.textContent.includes('Vui lòng đăng nhập')) {
              loginMessage.textContent = `Lịch sử xem của ${username}`;
              const loginButton = loginMessage.nextElementSibling;
              if (loginButton && loginButton.textContent.includes('Đăng nhập')) {
                  loginButton.remove();
              }
          }
      }
  }
}

// Function to handle logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('roleId');

  const userDropdown = document.querySelector('.nav-item.dropdown.ms-5');

  if (userDropdown) {
      userDropdown.innerHTML = `
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
              Đăng nhập/Đăng ký
          </a>
          <ul class="dropdown-menu">
              <button type="button" class="btn btn-success ms-5" data-bs-toggle="modal" data-bs-target="#login">Đăng nhập</button>
              <li><hr class="dropdown-divider"></li>
              <button type="button" class="btn btn-outline-success ms-5" data-bs-toggle="modal" data-bs-target="#logup" style="width: 105px;">Đăng ký</button>
          </ul>
      `;

      const historyModal = document.getElementById('history');
      if (historyModal) {
          const historyContent = historyModal.querySelector('h1');
          if (historyContent) {
              historyContent.textContent = 'Vui lòng đăng nhập để xem lại lịch sử xem!!!';
              if (!historyContent.nextElementSibling || !historyContent.nextElementSibling.textContent.includes('Đăng nhập')) {
                  const loginButton = document.createElement('button');
                  loginButton.type = 'button';
                  loginButton.className = 'btn btn-success ms-5';
                  loginButton.setAttribute('data-bs-toggle', 'modal');
                  loginButton.setAttribute('data-bs-target', '#login');
                  loginButton.textContent = 'Đăng nhập tại đây';
                  historyContent.after(loginButton);
              }
          }
      }
  }

  setTimeout(() => {
      window.location.href = '/'; // Quay lại index.ejs
  }, 500);
}