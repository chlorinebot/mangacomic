// logup.js - Client-side script for handling registration functionality

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('#logup .modal-body');
    const registerButton = registerForm.querySelector('button[type="submit"]');
    
    if (registerForm && registerButton) {
      registerButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Get form values
        const email = registerForm.querySelector('input[type="email"]').value;
        const username = registerForm.querySelector('textarea').value;
        const password = document.getElementById('inputPassword6').value;
        const confirmPassword = document.getElementById('inputPassword5').value;
        
        // Validate input
        if (!email || !username || !password || !confirmPassword) {
          showRegisterMessage('Vui lòng điền đầy đủ thông tin', 'danger');
          return;
        }
        
        if (password !== confirmPassword) {
          showRegisterMessage('Mật khẩu xác nhận không khớp', 'danger');
          return;
        }
        
        // Password strength validation
        if (!validatePassword(password)) {
          showRegisterMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt', 'danger');
          return;
        }
        
        // Send registration request to server
        fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            username,
            password
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
            // Show success message
            showRegisterMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.', 'success');
            
            // Clear form
            registerForm.querySelector('input[type="email"]').value = '';
            registerForm.querySelector('textarea').value = '';
            document.getElementById('inputPassword6').value = '';
            document.getElementById('inputPassword5').value = '';
            
            // Switch to login modal after short delay
            setTimeout(() => {
              const registerModal = bootstrap.Modal.getInstance(document.getElementById('logup'));
              registerModal.hide();
              
              // Open login modal
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
      const showPasswordCheckbox = document.getElementById('flexCheckDefault');
      if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', function() {
          const passwordField = document.getElementById('inputPassword6');
          const confirmPasswordField = document.getElementById('inputPassword5');
          
          const type = this.checked ? 'text' : 'password';
          passwordField.type = type;
          confirmPasswordField.type = type;
        });
      }
    }
  });
  
  function showRegisterMessage(message, type) {
    const registerForm = document.querySelector('#logup .modal-body');
    
    // Remove any existing alerts
    const existingAlert = registerForm.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} mt-3`;
    alertElement.role = 'alert';
    alertElement.textContent = message;
    
    // Add alert to form before the button
    const submitButton = registerForm.querySelector('button[type="submit"]');
    registerForm.insertBefore(alertElement, submitButton);
    
    // Auto-remove alert after 3 seconds
    setTimeout(() => {
      alertElement.remove();
    }, 3000);
  }
  
  function validatePassword(password) {
    // Password must be at least 8 characters long and contain at least one uppercase, one lowercase, one number, and one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }