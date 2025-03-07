document.addEventListener('DOMContentLoaded', function() {
    // Lấy phần tử switch, thẻ body, và thẻ label
    const darkModeSwitch = document.getElementById('flexSwitchCheckDefault');
    const bodyElement = document.body;
    const labelElement = document.querySelector('label[for="flexSwitchCheckDefault"]');
    
    // Kiểm tra trạng thái ban đầu của switch (nếu đã được lưu trước đó)
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
      darkModeSwitch.checked = true;
      bodyElement.classList.add('p-3', 'mb-2', 'bg-black', 'text-white');
      labelElement.textContent = 'Chế độ nền sáng';
      labelElement.style.color = 'black'; // Thêm màu đen cho chữ label
    } else {
      labelElement.textContent = 'Chế độ nền đêm';
      labelElement.style.color = ''; // Màu mặc định
    }
    
    // Thêm sự kiện lắng nghe khi người dùng thay đổi trạng thái switch
    darkModeSwitch.addEventListener('change', function() {
      if (this.checked) {
        // Khi switch được bật (chế độ tối)
        bodyElement.classList.add('p-3', 'mb-2', 'bg-black', 'text-white');
        labelElement.textContent = 'Chế độ nền sáng';
        labelElement.style.color = 'black'; // Thêm màu đen cho chữ label
        // Lưu trạng thái vào localStorage
        localStorage.setItem('darkMode', 'enabled');
      } else {
        // Khi switch được tắt (chế độ sáng)
        bodyElement.classList.remove('p-3', 'mb-2', 'bg-black', 'text-white');
        labelElement.textContent = 'Chế độ nền đêm';
        labelElement.style.color = ''; // Trở về màu mặc định
        // Lưu trạng thái vào localStorage
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  });