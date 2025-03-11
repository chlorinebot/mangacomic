// Lấy các phần tử DOM khi tài liệu đã tải xong
document.addEventListener("DOMContentLoaded", function() {
    // Lấy các phần tử từ form
    const emailInput = document.getElementById("exampleInputEmail1");
    const usernameInput = document.getElementById("exampleFormControlTextarea1");
    const passwordInput = document.getElementById("inputPassword6");
    const confirmPasswordInput = document.getElementById("inputPassword5");
    const showPasswordCheckbox = document.getElementById("flexCheckDefault");
    const registerButton = document.querySelector(".modal-body button[type='submit']");
    
    // Kiểm tra xem các phần tử đã được tìm thấy chưa
    console.log('Email Input:', emailInput);
    console.log('Username Input:', usernameInput);
    console.log('Password Input:', passwordInput);
    console.log('Confirm Password Input:', confirmPasswordInput);
    console.log('Show Password Checkbox:', showPasswordCheckbox);
    console.log('Register Button:', registerButton);
    
    // Thêm sự kiện cho checkbox hiển thị mật khẩu
    if (showPasswordCheckbox) {
      showPasswordCheckbox.addEventListener("change", function() {
        if (this.checked) {
          passwordInput.type = "text";
          confirmPasswordInput.type = "text";
        } else {
          passwordInput.type = "password";
          confirmPasswordInput.type = "password";
        }
      });
    }
    
    // Hàm kiểm tra định dạng email
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    // Hàm kiểm tra mật khẩu mạnh
    function isStrongPassword(password) {
      // Kiểm tra độ dài từ 8-20 ký tự
      if (password.length < 8 || password.length > 20) return false;
      
      // Kiểm tra có chữ hoa
      if (!/[A-Z]/.test(password)) return false;
      
      // Kiểm tra có chữ thường
      if (!/[a-z]/.test(password)) return false;
      
      // Kiểm tra có số
      if (!/[0-9]/.test(password)) return false;
      
      // Kiểm tra có ký tự đặc biệt
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
      
      return true;
    }
    
    // Thêm sự kiện kiểm tra email theo thời gian thực
    if (emailInput) {
      // Kiểm tra khi người dùng nhập
      emailInput.addEventListener("input", function() {
        validateEmail();
      });
      
      // Kiểm tra khi người dùng rời khỏi trường email
      emailInput.addEventListener("blur", function() {
        validateEmail();
      });
    }
    
    // Thêm sự kiện kiểm tra username khi rời khỏi trường
    if (usernameInput) {
      usernameInput.addEventListener("blur", function() {
        validateUsername();
      });
    }
    
    // Thêm sự kiện kiểm tra mật khẩu theo thời gian thực
    if (passwordInput) {
      passwordInput.addEventListener("input", function() {
        validatePassword();
        // Nếu trường xác nhận mật khẩu đã có giá trị, kiểm tra lại xác nhận
        if (confirmPasswordInput && confirmPasswordInput.value) {
          validateConfirmPassword();
        }
      });
      
      // Kiểm tra khi người dùng rời khỏi trường mật khẩu
      passwordInput.addEventListener("blur", function() {
        validatePassword();
      });
    }
    
    // Thêm sự kiện kiểm tra xác nhận mật khẩu theo thời gian thực
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", function() {
        validateConfirmPassword();
      });
      
      // Kiểm tra khi người dùng rời khỏi trường xác nhận mật khẩu
      confirmPasswordInput.addEventListener("blur", function() {
        validateConfirmPassword();
      });
    }
    
    // Hàm kiểm tra và hiển thị cảnh báo cho email
    function validateEmail() {
      if (!emailInput) return false;
      
      const email = emailInput.value.trim();
      removeError(emailInput);
      
      if (!email) {
        showError(emailInput, "Vui lòng nhập email", "red");
        return false;
      } else if (!isValidEmail(email)) {
        showError(emailInput, "Email không hợp lệ (phải có định dạng example@domain.com)", "red");
        return false;
      }
      
      // Hiển thị thông báo thành công
      showSuccess(emailInput, "Email hợp lệ");
      return true;
    }
  
    // Hàm kiểm tra và hiển thị cảnh báo cho username
    function validateUsername() {
      if (!usernameInput) return false;
      
      const username = usernameInput.value.trim();
      removeError(usernameInput);
      
      if (!username) {
        showError(usernameInput, "Vui lòng nhập tên người dùng", "red");
        return false;
      }
      
      // Hiển thị thông báo thành công
      showSuccess(usernameInput, "Tên người dùng hợp lệ");
      return true;
    }
    
    // Hàm kiểm tra và hiển thị cảnh báo cho mật khẩu
    function validatePassword() {
      if (!passwordInput) return false;
      
      const password = passwordInput.value;
      removeError(passwordInput);
      
      if (!password) {
        showError(passwordInput, "Vui lòng nhập mật khẩu", "red");
        return false;
      }
      
      // Kiểm tra các yêu cầu về mật khẩu và hiển thị thông báo cụ thể
      let errorMessage = "";
      
      if (password.length < 8 || password.length > 20) {
        errorMessage += "• Độ dài phải từ 8 đến 20 ký tự<br>";
      }
      
      if (!/[A-Z]/.test(password)) {
        errorMessage += "• Phải có ít nhất 1 chữ hoa<br>";
      }
      
      if (!/[a-z]/.test(password)) {
        errorMessage += "• Phải có ít nhất 1 chữ thường<br>";
      }
      
      if (!/[0-9]/.test(password)) {
        errorMessage += "• Phải có ít nhất 1 chữ số<br>";
      }
      
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errorMessage += "• Phải có ít nhất 1 ký tự đặc biệt";
      }
      
      if (errorMessage) {
        showError(passwordInput, "Mật khẩu không đủ mạnh:<br>" + errorMessage, "red");
        return false;
      }
      
      // Hiển thị thông báo thành công
      showSuccess(passwordInput, "Mật khẩu hợp lệ");
      return true;
    }
    
    // Hàm kiểm tra và hiển thị cảnh báo cho xác nhận mật khẩu
    function validateConfirmPassword() {
      if (!confirmPasswordInput || !passwordInput) return false;
      
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      removeError(confirmPasswordInput);
      
      if (!confirmPassword) {
        showError(confirmPasswordInput, "Vui lòng xác nhận mật khẩu", "red");
        return false;
      } else if (password !== confirmPassword) {
        showError(confirmPasswordInput, "Mật khẩu không khớp", "red");
        return false;
      }
      
      // Hiển thị thông báo thành công
      showSuccess(confirmPasswordInput, "Mật khẩu khớp");
      return true;
    }
    
    // Thêm sự kiện cho nút đăng ký
    if (registerButton) {
      registerButton.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Tạo cờ để kiểm tra tất cả các trường
        let hasErrors = false;
        
        // Kiểm tra từng trường và hiển thị tất cả các lỗi
        if (!validateEmail()) {
          hasErrors = true;
        }
        
        if (!validateUsername()) {
          hasErrors = true;
        }
        
        if (!validatePassword()) {
          hasErrors = true;
        }
        
        if (!validateConfirmPassword()) {
          hasErrors = true;
        }
        
        // Nếu có lỗi, hiển thị thông báo tổng quát
        if (hasErrors) {
          // Tạo thông báo cảnh báo
          showGlobalError("Vui lòng điền đầy đủ thông tin và sửa các lỗi trước khi đăng ký!");
          return;
        }
        
        // Nếu tất cả đều hợp lệ, gửi dữ liệu đăng ký
        registerUser(emailInput.value.trim(), usernameInput.value.trim(), passwordInput.value);
      });
    }
    
    // Hàm hiển thị thông báo lỗi chung
    function showGlobalError(message) {
      // Xóa thông báo lỗi chung cũ nếu có
      const oldGlobalError = document.getElementById("global-error-message");
      if (oldGlobalError) {
        oldGlobalError.remove();
      }
      
      // Tạo phần tử div hiển thị lỗi chung
      const globalErrorDiv = document.createElement("div");
      globalErrorDiv.id = "global-error-message";
      globalErrorDiv.className = "alert alert-danger mt-3";
      globalErrorDiv.style.fontSize = "1rem";
      globalErrorDiv.style.padding = "10px";
      globalErrorDiv.style.borderRadius = "5px";
      globalErrorDiv.innerHTML = `<strong>Lỗi!</strong> ${message}`;
      
      // Chèn thông báo lỗi vào đầu modal-body
      const modalBody = document.querySelector(".modal-body");
      if (modalBody) {
        modalBody.insertBefore(globalErrorDiv, modalBody.firstChild);
        
        // Tự động cuộn lên đầu để người dùng thấy thông báo
        modalBody.scrollTop = 0;
        
        // Làm nổi bật thông báo bằng cách thêm hiệu ứng nhấp nháy
        setTimeout(() => {
          globalErrorDiv.style.transition = "background-color 0.5s";
          globalErrorDiv.style.backgroundColor = "#ffd2d2";
          
          setTimeout(() => {
            globalErrorDiv.style.backgroundColor = "";
          }, 500);
        }, 100);
      }
    }
    
    // Hàm hiển thị lỗi
    function showError(inputElement, message, color = "red") {
      if (!inputElement) return;
      
      // Xóa thông báo cũ nếu có
      removeError(inputElement);
      
      // Tạo phần tử div hiển thị lỗi
      const errorDiv = document.createElement("div");
      errorDiv.className = "feedback-message";
      errorDiv.innerHTML = message;
      errorDiv.style.color = color;
      errorDiv.style.fontSize = "0.875rem";
      errorDiv.style.marginTop = "0.25rem";
      
      // Thêm lớp is-invalid cho input
      inputElement.classList.add("is-invalid");
      inputElement.style.borderColor = color;
      
      // Chèn thông báo lỗi sau input
      inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
      
      // Thêm hiệu ứng rung cho input khi có lỗi
      inputElement.style.animation = "shake 0.5s";
      setTimeout(() => {
        inputElement.style.animation = "";
      }, 500);
    }
    
    // Thêm style cho hiệu ứng rung
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    // Hàm hiển thị thông báo thành công
    function showSuccess(inputElement, message) {
      if (!inputElement) return;
      
      // Xóa thông báo cũ nếu có
      removeError(inputElement);
      
      // Tạo phần tử div hiển thị thành công
      const successDiv = document.createElement("div");
      successDiv.className = "feedback-message";
      successDiv.textContent = message;
      successDiv.style.color = "green";
      successDiv.style.fontSize = "0.875rem";
      successDiv.style.marginTop = "0.25rem";
      
      // Thêm lớp is-valid cho input
      inputElement.classList.remove("is-invalid");
      inputElement.classList.add("is-valid");
      inputElement.style.borderColor = "green";
      
      // Chèn thông báo thành công sau input
      inputElement.parentNode.insertBefore(successDiv, inputElement.nextSibling);
    }
    
    // Hàm xóa thông báo
    function removeError(inputElement) {
      if (!inputElement) return;
      
      // Xóa lớp is-invalid và is-valid
      inputElement.classList.remove("is-invalid", "is-valid");
      inputElement.style.borderColor = "";
      
      // Xóa thông báo cũ nếu có
      const oldFeedbacks = inputElement.parentNode.querySelectorAll(".feedback-message");
      oldFeedbacks.forEach(feedback => {
        feedback.remove();
      });
    }
    
    // Hàm xử lý đăng ký người dùng
    function registerUser(email, username, password) {
      // Tạo đối tượng dữ liệu để gửi đi
      const userData = {
        email: email,
        username: username,
        password: password
      };
      
      // Ở đây bạn có thể sử dụng fetch hoặc XMLHttpRequest để gửi dữ liệu đến máy chủ
      // Đây chỉ là ví dụ, hãy thay thế bằng API thực tế của bạn
      console.log("Đăng ký người dùng:", userData);
      
      // Xóa thông báo lỗi chung nếu có
      const oldGlobalError = document.getElementById("global-error-message");
      if (oldGlobalError) {
        oldGlobalError.remove();
      }
      
      // Hiển thị thông báo thành công
      const globalSuccessDiv = document.createElement("div");
      globalSuccessDiv.id = "global-success-message";
      globalSuccessDiv.className = "alert alert-success mt-3";
      globalSuccessDiv.style.fontSize = "1rem";
      globalSuccessDiv.style.padding = "10px";
      globalSuccessDiv.style.borderRadius = "5px";
      globalSuccessDiv.innerHTML = "<strong>Thành công!</strong> Đăng ký tài khoản thành công!";
      
      // Chèn thông báo thành công vào đầu modal-body
      const modalBody = document.querySelector(".modal-body");
      if (modalBody) {
        modalBody.insertBefore(globalSuccessDiv, modalBody.firstChild);
      }
      
      // Giả lập đăng ký thành công sau 2 giây
      setTimeout(() => {
        // Xóa thông báo thành công
        if (globalSuccessDiv) {
          globalSuccessDiv.remove();
        }
        
        // Đóng modal đăng ký
        const modal = bootstrap.Modal.getInstance(document.getElementById('logup'));
        if (modal) {
          modal.hide();
        }
        
        // Reset form và các thông báo
        if (emailInput) {
          emailInput.value = "";
          removeError(emailInput);
        }
        
        if (usernameInput) {
          usernameInput.value = "";
          removeError(usernameInput);
        }
        
        if (passwordInput) {
          passwordInput.value = "";
          removeError(passwordInput);
        }
        
        if (confirmPasswordInput) {
          confirmPasswordInput.value = "";
          removeError(confirmPasswordInput);
        }
      }, 2000);
    }
  });