document.addEventListener('DOMContentLoaded', function() {
  // Lấy phần tử switch, thẻ body, và thẻ label
  const darkModeSwitch = document.getElementById('flexSwitchCheckDefault');
  const bodyElement = document.body;
  const labelElement = document.querySelector('label[for="flexSwitchCheckDefault"]');
  const headerElement = document.querySelector('h1');
  const footerElement = document.querySelector('footer');
  const footerTextElement = document.querySelector('footer p');
  const paginationElement = document.querySelector('.pagination');
  const pageLinks = document.querySelectorAll('.page-link');
  const pageItems = document.querySelectorAll('.page-item');
  const navbarElement = document.querySelector('.navbar');
  const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarBrand = document.querySelector('.navbar-brand');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const searchBox = document.querySelector('.form-control');
  // Thêm selector cho các thẻ card mới
  const cardElements = document.querySelectorAll('.card');
  const cardTitles = document.querySelectorAll('.card-title');
  const cardTexts = document.querySelectorAll('.card-text');
  const cardBodies = document.querySelectorAll('.card-body');
  
  // Kiểm tra trạng thái ban đầu của switch (nếu đã được lưu trước đó)
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'enabled') {
      // Áp dụng chế độ tối
      enableDarkMode();
  } else {
      // Áp dụng chế độ sáng
      disableDarkMode();
  }
  
  // Thêm sự kiện lắng nghe khi người dùng thay đổi trạng thái switch
  darkModeSwitch.addEventListener('change', function() {
      if (this.checked) {
          // Khi switch được bật (chế độ tối)
          enableDarkMode();
      } else {
          // Khi switch được tắt (chế độ sáng)
          disableDarkMode();
      }
  });
  
  // Hàm bật chế độ tối
  function enableDarkMode() {
      darkModeSwitch.checked = true;
      
      // Thay đổi body
      bodyElement.classList.add('p-3', 'mb-2', 'bg-black', 'text-white');
      
      // Thay đổi label
      labelElement.textContent = 'Chế độ nền sáng';
      labelElement.style.color = 'white'; // Đổi thành màu trắng để dễ nhìn trên nền đen
      
      // Thay đổi tiêu đề h1 với nền đen và chữ trắng
      if (headerElement) {
          headerElement.style.backgroundColor = '#000';
          headerElement.style.color = '#fff';
          headerElement.style.padding = '15px';
          headerElement.style.borderRadius = '5px';
          headerElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
      }
      
      // Thay đổi navbar
      if (navbarElement) {
          navbarElement.classList.remove('bg-body-tertiary');
          navbarElement.classList.add('navbar-dark', 'bg-dark');
          navbarElement.style.color = '#fff';
          navbarElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
      }
      
      // Thay đổi navbar brand
      if (navbarBrand) {
          navbarBrand.style.color = '#fff';
      }
      
      // Thay đổi navbar links
      if (navbarLinks) {
          navbarLinks.forEach(link => {
              link.style.color = '#fff';
              // Stye active link
              if (link.classList.contains('active')) {
                  link.style.color = '#fff';
                  link.style.fontWeight = 'bold';
              }
          });
      }
      
      // Thay đổi dropdown menu
      if (dropdownMenu) {
          dropdownMenu.classList.add('dropdown-menu-dark');
          dropdownMenu.style.backgroundColor = '#343a40';
          dropdownMenu.style.borderColor = '#212529';
      }
      
      // Thay đổi dropdown items
      if (dropdownItems) {
          dropdownItems.forEach(item => {
              item.style.color = '#e9ecef';
          });
      }
      
      // Thay đổi search box
      if (searchBox) {
          searchBox.style.backgroundColor = '#2b3035';
          searchBox.style.borderColor = '#495057';
          searchBox.style.color = '#fff';
      }
      
      // Thay đổi footer
      if (footerElement) {
          footerElement.classList.remove('bg-light', 'bg-body-tertiary');
          footerElement.classList.add('bg-dark');
          footerElement.style.borderTop = '1px solid #343a40';
      }
      
      // Thay đổi văn bản footer
      if (footerTextElement) {
          footerTextElement.style.color = '#adb5bd'; // Màu xám nhạt cho văn bản footer
      }
      
      // Thay đổi pagination cho phù hợp với nền đen
      if (paginationElement) {
          // Áp dụng kiểu phân trang tối cho tất cả các liên kết trang
          pageLinks.forEach(link => {
              // Đặt màu nền và màu chữ cho tất cả các liên kết trang
              link.style.backgroundColor = '#333';
              link.style.color = '#fff';
              link.style.borderColor = '#444';
          });
          
          // Kiểu dáng đặc biệt cho nút trang hiện tại (active)
          pageItems.forEach(item => {
              if (item.classList.contains('active')) {
                  const activeLink = item.querySelector('.page-link');
                  if (activeLink) {
                      activeLink.style.backgroundColor = '#0d6efd';
                      activeLink.style.borderColor = '#0d6efd';
                      activeLink.style.color = '#fff';
                  }
              }
              
              // Kiểu dáng cho nút bị vô hiệu hóa (disabled)
              if (item.classList.contains('disabled')) {
                  const disabledLink = item.querySelector('.page-link');
                  if (disabledLink) {
                      disabledLink.style.backgroundColor = '#222';
                      disabledLink.style.color = '#666';
                      disabledLink.style.borderColor = '#333';
                  }
              }
          });
      }
      
      // Thay đổi card cho phù hợp với chế độ tối
      if (cardElements.length > 0) {
          cardElements.forEach(card => {
              card.style.backgroundColor = '#212529';
              card.style.borderColor = '#343a40';
              card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
          });
      }
      
      // Thay đổi card body
      if (cardBodies.length > 0) {
          cardBodies.forEach(cardBody => {
              cardBody.style.backgroundColor = '#212529';
          });
      }
      
      // Thay đổi card title
      if (cardTitles.length > 0) {
          cardTitles.forEach(title => {
              title.style.color = '#fff';
          });
      }
      
      // Thay đổi card text
      if (cardTexts.length > 0) {
          cardTexts.forEach(text => {
              text.style.color = '#adb5bd';
          });
      }
      
      // Lưu trạng thái vào localStorage
      localStorage.setItem('darkMode', 'enabled');
  }
  
  // Hàm tắt chế độ tối
  function disableDarkMode() {
      darkModeSwitch.checked = false;
      
      // Khôi phục body
      bodyElement.classList.remove('p-3', 'mb-2', 'bg-black', 'text-white');
      
      // Khôi phục label
      labelElement.textContent = 'Chế độ đêm tối';
      labelElement.style.color = ''; // Trở về màu mặc định
      
      // Khôi phục tiêu đề h1
      if (headerElement) {
          headerElement.style.backgroundColor = '';
          headerElement.style.color = '';
          headerElement.style.padding = '';
          headerElement.style.borderRadius = '';
          headerElement.style.boxShadow = '';
      }
      
      // Khôi phục navbar
      if (navbarElement) {
          navbarElement.classList.remove('navbar-dark', 'bg-dark');
          navbarElement.classList.add('bg-body-tertiary');
          navbarElement.style.color = '';
          navbarElement.style.boxShadow = '';
      }
      
      // Khôi phục navbar brand
      if (navbarBrand) {
          navbarBrand.style.color = '';
      }
      
      // Khôi phục navbar links
      if (navbarLinks) {
          navbarLinks.forEach(link => {
              link.style.color = '';
              if (link.classList.contains('active')) {
                  link.style.fontWeight = '';
              }
          });
      }
      
      // Khôi phục dropdown menu
      if (dropdownMenu) {
          dropdownMenu.classList.remove('dropdown-menu-dark');
          dropdownMenu.style.backgroundColor = '';
          dropdownMenu.style.borderColor = '';
      }
      
      // Khôi phục dropdown items
      if (dropdownItems) {
          dropdownItems.forEach(item => {
              item.style.color = '';
          });
      }
      
      // Khôi phục search box
      if (searchBox) {
          searchBox.style.backgroundColor = '';
          searchBox.style.borderColor = '';
          searchBox.style.color = '';
      }
      
      // Khôi phục footer
      if (footerElement) {
          footerElement.classList.remove('bg-dark');
          footerElement.classList.add('bg-light', 'bg-body-tertiary');
          footerElement.style.borderTop = '';
      }
      
      // Khôi phục văn bản footer
      if (footerTextElement) {
          footerTextElement.style.color = ''; // Trở về màu mặc định
      }
      
      // Khôi phục pagination
      if (paginationElement) {
          // Khôi phục tất cả các liên kết trang về mặc định
          pageLinks.forEach(link => {
              link.style.backgroundColor = '';
              link.style.color = '';
              link.style.borderColor = '';
          });
          
          // Không cần đặt lại kiểu dáng cho active và disabled vì Bootstrap sẽ xử lý chúng
      }
      
      // Khôi phục card
      if (cardElements.length > 0) {
          cardElements.forEach(card => {
              card.style.backgroundColor = '';
              card.style.borderColor = '';
              card.style.boxShadow = '';
          });
      }
      
      // Khôi phục card body
      if (cardBodies.length > 0) {
          cardBodies.forEach(cardBody => {
              cardBody.style.backgroundColor = '';
          });
      }
      
      // Khôi phục card title
      if (cardTitles.length > 0) {
          cardTitles.forEach(title => {
              title.style.color = '';
          });
      }
      
      // Khôi phục card text
      if (cardTexts.length > 0) {
          cardTexts.forEach(text => {
              text.style.color = '';
          });
      }
      
      // Lưu trạng thái vào localStorage
      localStorage.setItem('darkMode', 'disabled');
  }
});