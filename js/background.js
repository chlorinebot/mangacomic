document.addEventListener('DOMContentLoaded', function() {
  const darkModeSwitch = document.getElementById('flexSwitchCheckDefault');
  const bodyElement = document.body;
  const labelElement = document.querySelector('label[for="flexSwitchCheckDefault"]');
  const headerElement = document.querySelector('h1');
  const footerElement = document.querySelector('footer');
  const footerTextElement = document.querySelector('footer p');
  const paginationElement = document.querySelector('.pagination');
  const navbarElement = document.querySelector('.navbar');
  const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarBrand = document.querySelector('.navbar-brand');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const searchBox = document.querySelector('.form-control');
  const offcanvasElements = document.querySelectorAll('.offcanvas');
  const offcanvasHeaders = document.querySelectorAll('.offcanvas-header');
  const offcanvasTitles = document.querySelectorAll('.offcanvas-title');
  const offcanvasBodies = document.querySelectorAll('.offcanvas-body');
  const btnClose = document.querySelectorAll('.btn-close');
  const textBodySecondary = document.querySelectorAll('.text-body-secondary');

  // Kiểm tra trạng thái ban đầu
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }

  // Sự kiện thay đổi switch
  darkModeSwitch.addEventListener('change', function() {
    if (this.checked) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });

  // Hàm bật chế độ tối
  function enableDarkMode() {
    darkModeSwitch.checked = true;

    bodyElement.classList.add('p-3', 'mb-2', 'bg-black', 'text-white');
    labelElement.textContent = 'Chế độ nền sáng';
    labelElement.style.color = 'white';

    if (headerElement) {
      headerElement.style.backgroundColor = '#000';
      headerElement.style.color = '#fff';
      headerElement.style.padding = '15px';
      headerElement.style.borderRadius = '5px';
      headerElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
    }

    if (navbarElement) {
      navbarElement.classList.remove('bg-body-tertiary');
      navbarElement.classList.add('navbar-dark', 'bg-dark');
      navbarElement.style.color = '#fff';
      navbarElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }

    if (navbarBrand) {
      navbarBrand.style.color = '#fff';
    }

    if (navbarLinks) {
      navbarLinks.forEach(link => {
        link.style.color = '#fff';
        if (link.classList.contains('active')) {
          link.style.color = '#fff';
          link.style.fontWeight = 'bold';
        }
      });
    }

    if (dropdownMenu) {
      dropdownMenu.classList.add('dropdown-menu-dark');
      dropdownMenu.style.backgroundColor = '#343a40';
      dropdownMenu.style.borderColor = '#212529';
    }

    if (dropdownItems) {
      dropdownItems.forEach(item => {
        item.style.color = '#e9ecef';
      });
    }

    if (searchBox) {
      searchBox.style.backgroundColor = '#2b3035';
      searchBox.style.borderColor = '#495057';
      searchBox.style.color = '#fff';
    }

    if (footerElement) {
      footerElement.classList.remove('bg-light', 'bg-body-tertiary');
      footerElement.classList.add('bg-dark');
      footerElement.style.borderTop = '1px solid #343a40';
    }

    if (footerTextElement) {
      footerTextElement.style.color = '#adb5bd';
    }

    if (paginationElement) {
      const pageLinks = document.querySelectorAll('.page-link');
      const pageItems = document.querySelectorAll('.page-item');
      pageLinks.forEach(link => {
        link.style.backgroundColor = '#333';
        link.style.color = '#fff';
        link.style.borderColor = '#444';
      });
      pageItems.forEach(item => {
        if (item.classList.contains('active')) {
          const activeLink = item.querySelector('.page-link');
          if (activeLink) {
            activeLink.style.backgroundColor = '#0d6efd';
            activeLink.style.borderColor = '#0d6efd';
            activeLink.style.color = '#fff';
          }
        }
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

    // Áp dụng chế độ tối cho tất cả card hiện tại
    const cardElements = document.querySelectorAll('.card');
    const cardBodies = document.querySelectorAll('.card-body');
    const cardTitles = document.querySelectorAll('.card-title');
    const cardTexts = document.querySelectorAll('.card-text');

    cardElements.forEach(card => {
      card.style.backgroundColor = '#212529';
      card.style.borderColor = '#343a40';
      card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
      card.style.color = '#fff';
    });

    cardBodies.forEach(cardBody => {
      cardBody.style.backgroundColor = '#212529';
      cardBody.style.color = '#fff';
    });

    cardTitles.forEach(title => {
      title.style.color = '#fff';
    });

    cardTexts.forEach(text => {
      text.style.color = '#adb5bd';
    });

    if (textBodySecondary.length > 0) {
      textBodySecondary.forEach(text => {
        text.style.color = '#6c757d';
      });
    }

    if (offcanvasElements.length > 0) {
      offcanvasElements.forEach(offcanvas => {
        offcanvas.style.backgroundColor = '#212529';
        offcanvas.style.color = '#fff';
        offcanvas.style.borderLeft = '1px solid #343a40';
      });
    }

    if (offcanvasHeaders.length > 0) {
      offcanvasHeaders.forEach(header => {
        header.style.backgroundColor = '#343a40';
        header.style.borderBottom = '1px solid #495057';
      });
    }

    if (offcanvasTitles.length > 0) {
      offcanvasTitles.forEach(title => {
        title.style.color = '#fff';
      });
    }

    if (offcanvasBodies.length > 0) {
      offcanvasBodies.forEach(body => {
        body.style.backgroundColor = '#212529';
      });
    }

    if (btnClose.length > 0) {
      btnClose.forEach(btn => {
        btn.style.filter = 'invert(1)';
        btn.style.opacity = '0.8';
      });
    }

    localStorage.setItem('darkMode', 'enabled');
  }

  // Hàm tắt chế độ tối
  function disableDarkMode() {
    darkModeSwitch.checked = false;

    bodyElement.classList.remove('p-3', 'mb-2', 'bg-black', 'text-white');
    labelElement.textContent = 'Chế độ đêm tối';
    labelElement.style.color = '';

    if (headerElement) {
      headerElement.style.backgroundColor = '';
      headerElement.style.color = '';
      headerElement.style.padding = '';
      headerElement.style.borderRadius = '';
      headerElement.style.boxShadow = '';
    }

    if (navbarElement) {
      navbarElement.classList.remove('navbar-dark', 'bg-dark');
      navbarElement.classList.add('bg-body-tertiary');
      navbarElement.style.color = '';
      navbarElement.style.boxShadow = '';
    }

    if (navbarBrand) {
      navbarBrand.style.color = '';
    }

    if (navbarLinks) {
      navbarLinks.forEach(link => {
        link.style.color = '';
        if (link.classList.contains('active')) {
          link.style.fontWeight = '';
        }
      });
    }

    if (dropdownMenu) {
      dropdownMenu.classList.remove('dropdown-menu-dark');
      dropdownMenu.style.backgroundColor = '';
      dropdownMenu.style.borderColor = '';
    }

    if (dropdownItems) {
      dropdownItems.forEach(item => {
        item.style.color = '';
      });
    }

    if (searchBox) {
      searchBox.style.backgroundColor = '';
      searchBox.style.borderColor = '';
      searchBox.style.color = '';
    }

    if (footerElement) {
      footerElement.classList.remove('bg-dark');
      footerElement.classList.add('bg-light', 'bg-body-tertiary');
      footerElement.style.borderTop = '';
    }

    if (footerTextElement) {
      footerTextElement.style.color = '';
    }

    if (paginationElement) {
      const pageLinks = document.querySelectorAll('.page-link');
      pageLinks.forEach(link => {
        link.style.backgroundColor = '';
        link.style.color = '';
        link.style.borderColor = '';
      });
    }

    // Áp dụng chế độ sáng cho tất cả card hiện tại
    const cardElements = document.querySelectorAll('.card');
    const cardBodies = document.querySelectorAll('.card-body');
    const cardTitles = document.querySelectorAll('.card-title');
    const cardTexts = document.querySelectorAll('.card-text');

    cardElements.forEach(card => {
      card.style.backgroundColor = '#fff';
      card.style.borderColor = '#dee2e6';
      card.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
      card.style.color = '#212529';
    });

    cardBodies.forEach(cardBody => {
      cardBody.style.backgroundColor = '#fff';
      cardBody.style.color = '#212529';
    });

    cardTitles.forEach(title => {
      title.style.color = '#212529';
    });

    cardTexts.forEach(text => {
      text.style.color = '#6c757d';
    });

    if (textBodySecondary.length > 0) {
      textBodySecondary.forEach(text => {
        text.style.color = '';
      });
    }

    if (offcanvasElements.length > 0) {
      offcanvasElements.forEach(offcanvas => {
        offcanvas.style.backgroundColor = '';
        offcanvas.style.color = '';
        offcanvas.style.borderLeft = '';
      });
    }

    if (offcanvasHeaders.length > 0) {
      offcanvasHeaders.forEach(header => {
        header.style.backgroundColor = '';
        header.style.borderBottom = '';
      });
    }

    if (offcanvasTitles.length > 0) {
      offcanvasTitles.forEach(title => {
        title.style.color = '';
      });
    }

    if (offcanvasBodies.length > 0) {
      offcanvasBodies.forEach(body => {
        body.style.backgroundColor = '';
      });
    }

    if (btnClose.length > 0) {
      btnClose.forEach(btn => {
        btn.style.filter = '';
        btn.style.opacity = '';
      });
    }

    localStorage.setItem('darkMode', 'disabled');
  }
});