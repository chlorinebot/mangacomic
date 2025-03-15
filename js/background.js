document.addEventListener('DOMContentLoaded', function() {
  const darkModeSwitch = document.getElementById('flexSwitchCheckDefault');
  const bodyElement = document.body;
  const labelElement = document.querySelector('label[for="flexSwitchCheckDefault"]');
  
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
    localStorage.setItem('darkMode', 'enabled');

    // Body
    bodyElement.classList.add('p-3', 'mb-2', 'bg-black', 'text-white');
    labelElement.textContent = 'Chế độ nền sáng';
    labelElement.style.color = 'white';

    // Header
    const headerElement = document.querySelector('h1');
    if (headerElement) {
      headerElement.style.backgroundColor = '#000';
      headerElement.style.color = '#fff';
      headerElement.style.padding = '15px';
      headerElement.style.borderRadius = '5px';
      headerElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
    }

    // Navbar
    const navbarElement = document.querySelector('.navbar');
    if (navbarElement) {
      navbarElement.classList.remove('bg-body-tertiary');
      navbarElement.classList.add('navbar-dark', 'bg-dark');
      navbarElement.style.color = '#fff';
      navbarElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }

    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
      navbarBrand.style.color = '#fff';
    }

    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (navbarLinks) {
      navbarLinks.forEach(link => {
        link.style.color = '#fff';
        if (link.classList.contains('active')) {
          link.style.color = '#fff';
          link.style.fontWeight = 'bold';
        }
      });
    }

    // Dropdown
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.add('dropdown-menu-dark');
      dropdownMenu.style.backgroundColor = '#343a40';
      dropdownMenu.style.borderColor = '#212529';
    }

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    if (dropdownItems) {
      dropdownItems.forEach(item => {
        item.style.color = '#e9ecef';
      });
    }

    // Search box
    const searchBox = document.querySelector('.form-control');
    if (searchBox) {
      searchBox.style.backgroundColor = '#2b3035';
      searchBox.style.borderColor = '#495057';
      searchBox.style.color = '#fff';
    }

    // Footer
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.classList.remove('bg-light', 'bg-body-tertiary');
      footerElement.classList.add('bg-dark');
      footerElement.style.borderTop = '1px solid #343a40';
    }

    const footerTextElement = document.querySelector('footer p');
    if (footerTextElement) {
      footerTextElement.style.color = '#adb5bd';
    }

    // Pagination
    const paginationElement = document.querySelector('.pagination');
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

    // Cards
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

    // Secondary text
    const textBodySecondary = document.querySelectorAll('.text-body-secondary');
    if (textBodySecondary.length > 0) {
      textBodySecondary.forEach(text => {
        text.style.color = '#6c757d';
      });
    }

    // Offcanvas
    const offcanvasElements = document.querySelectorAll('.offcanvas');
    if (offcanvasElements.length > 0) {
      offcanvasElements.forEach(offcanvas => {
        offcanvas.style.backgroundColor = '#212529';
        offcanvas.style.color = '#fff';
        offcanvas.style.borderLeft = '1px solid #343a40';
      });
    }

    const offcanvasHeaders = document.querySelectorAll('.offcanvas-header');
    if (offcanvasHeaders.length > 0) {
      offcanvasHeaders.forEach(header => {
        header.style.backgroundColor = '#343a40';
        header.style.borderBottom = '1px solid #495057';
      });
    }

    const offcanvasTitles = document.querySelectorAll('.offcanvas-title');
    if (offcanvasTitles.length > 0) {
      offcanvasTitles.forEach(title => {
        title.style.color = '#fff';
      });
    }

    const offcanvasBodies = document.querySelectorAll('.offcanvas-body');
    if (offcanvasBodies.length > 0) {
      offcanvasBodies.forEach(body => {
        body.style.backgroundColor = '#212529';
      });
    }

    const btnClose = document.querySelectorAll('.btn-close');
    if (btnClose.length > 0) {
      btnClose.forEach(btn => {
        btn.style.filter = 'invert(1)';
        btn.style.opacity = '0.8';
      });
    }

    // THÊM MỚI: Xử lý modal login và signup
    const modals = document.querySelectorAll('.modal-content');
    const modalHeaders = document.querySelectorAll('.modal-header');
    const modalBodies = document.querySelectorAll('.modal-body');
    const modalFooters = document.querySelectorAll('.modal-footer');
    const modalTitles = document.querySelectorAll('.modal-title');
    const formLabels = document.querySelectorAll('.form-label');
    const formText = document.querySelectorAll('.form-text');
    const formCheckLabel = document.querySelectorAll('.form-check-label');

    if (modals.length > 0) {
      modals.forEach(modal => {
        modal.style.backgroundColor = '#212529';
        modal.style.color = '#fff';
        modal.style.borderColor = '#343a40';
      });
    }

    if (modalHeaders.length > 0) {
      modalHeaders.forEach(header => {
        header.style.backgroundColor = '#343a40';
        header.style.borderBottom = '1px solid #495057';
      });
    }

    if (modalBodies.length > 0) {
      modalBodies.forEach(body => {
        body.style.backgroundColor = '#212529';
        body.style.color = '#fff';
      });
    }

    if (modalFooters.length > 0) {
      modalFooters.forEach(footer => {
        footer.style.backgroundColor = '#343a40';
        footer.style.borderTop = '1px solid #495057';
      });
    }

    if (modalTitles.length > 0) {
      modalTitles.forEach(title => {
        title.style.color = '#fff';
      });
    }

    if (formLabels.length > 0) {
      formLabels.forEach(label => {
        label.style.color = '#e9ecef';
      });
    }

    if (formText.length > 0) {
      formText.forEach(text => {
        text.style.color = '#adb5bd';
      });
    }

    if (formCheckLabel.length > 0) {
      formCheckLabel.forEach(label => {
        label.style.color = '#e9ecef';
      });
    }

    // Xử lý inputs trong modal
    const inputs = document.querySelectorAll('.modal .form-control');
    if (inputs.length > 0) {
      inputs.forEach(input => {
        input.style.backgroundColor = '#2b3035';
        input.style.borderColor = '#495057';
        input.style.color = '#fff';
      });
    }
  }

  // Hàm tắt chế độ tối
  function disableDarkMode() {
    darkModeSwitch.checked = false;
    localStorage.setItem('darkMode', 'disabled');

    // Body
    bodyElement.classList.remove('p-3', 'mb-2', 'bg-black', 'text-white');
    labelElement.textContent = 'Chế độ đêm tối';
    labelElement.style.color = '';

    // Header
    const headerElement = document.querySelector('h1');
    if (headerElement) {
      headerElement.style.backgroundColor = '';
      headerElement.style.color = '';
      headerElement.style.padding = '';
      headerElement.style.borderRadius = '';
      headerElement.style.boxShadow = '';
    }

    // Navbar
    const navbarElement = document.querySelector('.navbar');
    if (navbarElement) {
      navbarElement.classList.remove('navbar-dark', 'bg-dark');
      navbarElement.classList.add('bg-body-tertiary');
      navbarElement.style.color = '';
      navbarElement.style.boxShadow = '';
    }

    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
      navbarBrand.style.color = '';
    }

    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (navbarLinks) {
      navbarLinks.forEach(link => {
        link.style.color = '';
        if (link.classList.contains('active')) {
          link.style.fontWeight = '';
        }
      });
    }

    // Dropdown
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.remove('dropdown-menu-dark');
      dropdownMenu.style.backgroundColor = '';
      dropdownMenu.style.borderColor = '';
    }

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    if (dropdownItems) {
      dropdownItems.forEach(item => {
        item.style.color = '';
      });
    }

    // Search box
    const searchBox = document.querySelector('.form-control');
    if (searchBox) {
      searchBox.style.backgroundColor = '';
      searchBox.style.borderColor = '';
      searchBox.style.color = '';
    }

    // Footer
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.classList.remove('bg-dark');
      footerElement.classList.add('bg-light', 'bg-body-tertiary');
      footerElement.style.borderTop = '';
    }

    const footerTextElement = document.querySelector('footer p');
    if (footerTextElement) {
      footerTextElement.style.color = '';
    }

    // Pagination
    const paginationElement = document.querySelector('.pagination');
    if (paginationElement) {
      const pageLinks = document.querySelectorAll('.page-link');
      pageLinks.forEach(link => {
        link.style.backgroundColor = '';
        link.style.color = '';
        link.style.borderColor = '';
      });
    }

    // Cards
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

    // Secondary text
    const textBodySecondary = document.querySelectorAll('.text-body-secondary');
    if (textBodySecondary.length > 0) {
      textBodySecondary.forEach(text => {
        text.style.color = '';
      });
    }

    // Offcanvas
    const offcanvasElements = document.querySelectorAll('.offcanvas');
    if (offcanvasElements.length > 0) {
      offcanvasElements.forEach(offcanvas => {
        offcanvas.style.backgroundColor = '';
        offcanvas.style.color = '';
        offcanvas.style.borderLeft = '';
      });
    }

    const offcanvasHeaders = document.querySelectorAll('.offcanvas-header');
    if (offcanvasHeaders.length > 0) {
      offcanvasHeaders.forEach(header => {
        header.style.backgroundColor = '';
        header.style.borderBottom = '';
      });
    }

    const offcanvasTitles = document.querySelectorAll('.offcanvas-title');
    if (offcanvasTitles.length > 0) {
      offcanvasTitles.forEach(title => {
        title.style.color = '';
      });
    }

    const offcanvasBodies = document.querySelectorAll('.offcanvas-body');
    if (offcanvasBodies.length > 0) {
      offcanvasBodies.forEach(body => {
        body.style.backgroundColor = '';
      });
    }

    const btnClose = document.querySelectorAll('.btn-close');
    if (btnClose.length > 0) {
      btnClose.forEach(btn => {
        btn.style.filter = '';
        btn.style.opacity = '';
      });
    }

    // THÊM MỚI: Xử lý modal login và signup
    const modals = document.querySelectorAll('.modal-content');
    const modalHeaders = document.querySelectorAll('.modal-header');
    const modalBodies = document.querySelectorAll('.modal-body');
    const modalFooters = document.querySelectorAll('.modal-footer');
    const modalTitles = document.querySelectorAll('.modal-title');
    const formLabels = document.querySelectorAll('.form-label');
    const formText = document.querySelectorAll('.form-text');
    const formCheckLabel = document.querySelectorAll('.form-check-label');

    if (modals.length > 0) {
      modals.forEach(modal => {
        modal.style.backgroundColor = '';
        modal.style.color = '';
        modal.style.borderColor = '';
      });
    }

    if (modalHeaders.length > 0) {
      modalHeaders.forEach(header => {
        header.style.backgroundColor = '';
        header.style.borderBottom = '';
      });
    }

    if (modalBodies.length > 0) {
      modalBodies.forEach(body => {
        body.style.backgroundColor = '';
        body.style.color = '';
      });
    }

    if (modalFooters.length > 0) {
      modalFooters.forEach(footer => {
        footer.style.backgroundColor = '';
        footer.style.borderTop = '';
      });
    }

    if (modalTitles.length > 0) {
      modalTitles.forEach(title => {
        title.style.color = '';
      });
    }

    if (formLabels.length > 0) {
      formLabels.forEach(label => {
        label.style.color = '';
      });
    }

    if (formText.length > 0) {
      formText.forEach(text => {
        text.style.color = '';
      });
    }

    if (formCheckLabel.length > 0) {
      formCheckLabel.forEach(label => {
        label.style.color = '';
      });
    }

    // Xử lý inputs trong modal
    const inputs = document.querySelectorAll('.modal .form-control');
    if (inputs.length > 0) {
      inputs.forEach(input => {
        input.style.backgroundColor = '';
        input.style.borderColor = '';
        input.style.color = '';
      });
    }
  }
});