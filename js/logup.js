// logup.js - Client-side script for handling registration functionality

document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.querySelector('.pure-form');
  const registerButton = registerForm.querySelector('button[type="submit"]');

  if (!registerForm || !registerButton) return;

  // Lấy các trường input
  const usernameInput = registerForm.querySelector('#aligned-name');
  const emailInput = registerForm.querySelector('#aligned-email');
  const passwordInput = registerForm.querySelector('#aligned-password');
  const confirmPasswordInput = registerForm.querySelector('#aligned-confirm-password');
  const termsCheckbox = registerForm.querySelector('#aligned-cb-terms');
  const termsError = registerForm.querySelector('.pure-controls .error-message');

  // Thêm sự kiện validate thời gian thực
  const inputs = [usernameInput, emailInput, passwordInput, confirmPasswordInput];
  inputs.forEach(input => {
      if (input) {
          input.addEventListener('input', () => validateInput(input));
      }
  });

  // Kiểm tra mật khẩu xác nhận khi thay đổi
  if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener('input', () => validatePasswordMatch(confirmPasswordInput, passwordInput.value));
  }

  // Xử lý sự kiện submit
  registerButton.addEventListener('click', function(event) {
      event.preventDefault();

      // Validate all fields
      let isValid = true;
      inputs.forEach(input => {
          if (!validateInput(input)) isValid = false;
      });

      // Validate password match
      if (confirmPasswordInput && !validatePasswordMatch(confirmPasswordInput, passwordInput.value)) {
          isValid = false;
      }

      // Validate terms checkbox with blinking effect
      if (termsCheckbox && !termsCheckbox.checked) {
          showTermsError(termsError, 'Vui lòng đồng ý với điều khoản dịch vụ');
          isValid = false;
          setTimeout(() => {
              removeFieldError(termsCheckbox);
          }, 3000); // Xóa hiệu ứng sau 3 giây
      } else {
          removeFieldError(termsCheckbox);
      }

      if (!isValid) {
          showRegisterMessage('Vui lòng sửa các lỗi trước khi đăng ký', 'danger');
          return;
      }

      // Gửi request đăng ký
      fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              email: emailInput.value,
              username: usernameInput.value,
              password: passwordInput.value
          }),
      })
      .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
      })
      .then(data => {
          if (data.success) {
              showRegisterMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.', 'success');
              clearForm();
              setTimeout(() => {
                  const registerModal = bootstrap.Modal.getInstance(document.querySelector('#logup'));
                  registerModal.hide();
                  setTimeout(() => {
                      const loginModal = new bootstrap.Modal(document.getElementById('login'));
                      loginModal.show();
                  }, 500);
              }, 2000);
          } else {
              showRegisterMessage(data.message || 'Đăng ký thất bại. Vui lòng thử lại.', 'danger');
          }
      })
      .catch(error => {
          showRegisterMessage('Lỗi kết nối: ' + error.message, 'danger');
      });
  });

  // Toggle password visibility
  const showPasswordCheckbox = registerForm.querySelector('#aligned-cb-show');
  if (showPasswordCheckbox) {
      showPasswordCheckbox.addEventListener('change', function() {
          const passwordFields = [passwordInput, confirmPasswordInput];
          passwordFields.forEach(field => {
              field.type = this.checked ? 'text' : 'password';
          });
      });
  }
});

// Hàm validate từng trường
function validateInput(input) {
  let isValid = true;
  const errorMessages = {
      '#aligned-name': 'Tên người dùng chỉ được chứa chữ thường và số, tối đa 15 ký tự',
      '#aligned-email': 'Email không đúng định dạng',
      '#aligned-password': 'Mật khẩu phải dài 8-20 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
      '#aligned-confirm-password': 'Mật khẩu xác nhận không khớp'
  };

  if (!input.value.trim()) {
      showFieldError(input, 'Trường này không được để trống');
      return false;
  }

  switch (input.id) {
      case 'aligned-name':
          isValid = validateUsername(input.value);
          break;
      case 'aligned-email':
          isValid = validateEmail(input.value);
          break;
      case 'aligned-password':
          isValid = validatePassword(input.value);
          break;
      case 'aligned-confirm-password':
          isValid = validatePasswordMatch(input, document.querySelector('#aligned-password').value);
          break;
  }

  if (!isValid) {
      showFieldError(input, errorMessages[`#${input.id}`] || 'Dữ liệu không hợp lệ');
  } else {
      removeFieldError(input);
  }
  return isValid;
}

// Hàm validate mật khẩu xác nhận
function validatePasswordMatch(confirmInput, passwordValue) {
  if (!confirmInput.value.trim()) {
      showFieldError(confirmInput, 'Trường này không được để trống');
      return false;
  }
  if (confirmInput.value !== passwordValue) {
      showFieldError(confirmInput, 'Mật khẩu xác nhận không khớp');
      return false;
  }
  removeFieldError(confirmInput);
  return true;
}

// Hàm hiển thị lỗi cho checkbox điều khoản với hiệu ứng nhấp nháy
function showTermsError(errorElement, message) {
  errorElement.style.color = 'red';
  errorElement.style.fontSize = '12px';
  errorElement.textContent = message;
  errorElement.classList.add('blink');
  setTimeout(() => {
      errorElement.classList.remove('blink');
  }, 3000); // Hiệu ứng nhấp nháy trong 3 giây
}

// Hàm hiển thị lỗi cho các trường khác
function showFieldError(input, message) {
  removeFieldError(input);
  input.classList.add('is-invalid');
  const errorElement = input.parentNode.querySelector('.error-message');
  errorElement.style.color = 'red';
  errorElement.style.fontSize = '12px';
  errorElement.textContent = message;
}

// Hàm xóa thông báo lỗi
function removeFieldError(input) {
  input.classList.remove('is-invalid', 'is-valid');
  const errorElement = input.parentNode.querySelector('.error-message');
  if (errorElement) errorElement.textContent = '';
}

// Hàm hiển thị thông báo chung
function showRegisterMessage(message, type) {
  const registerForm = document.querySelector('.pure-form');
  const existingAlert = registerForm.querySelector('.alert');
  if (existingAlert) existingAlert.remove();

  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type} mt-3`;
  alertElement.role = 'alert';
  alertElement.textContent = message;
  registerForm.querySelector('.pure-controls').insertBefore(alertElement, registerForm.querySelector('button[type="submit"]'));
  setTimeout(() => alertElement.remove(), 3000);
}

// Hàm xóa form
function clearForm() {
  const registerForm = document.querySelector('.pure-form');
  registerForm.querySelectorAll('input').forEach(input => {
      input.value = '';
      removeFieldError(input);
  });
  if (registerForm.querySelector('#aligned-cb-terms')) registerForm.querySelector('#aligned-cb-terms').checked = false;
  if (registerForm.querySelector('#aligned-cb-show')) registerForm.querySelector('#aligned-cb-show').checked = false;
}

// Validation functions
function validateUsername(username) {
  return /^[a-z0-9]{1,15}$/.test(username);
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);
}

function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}