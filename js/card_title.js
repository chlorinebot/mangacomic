// Dữ liệu cho các card
const cardData = [
    {
      id: 1,
      title: "Sản phẩm 1",
      image: "https://example.com/images/product1.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 1. Sản phẩm có nhiều tính năng hữu ích.",
      link: "#product1"
    },
    {
      id: 2,
      title: "Sản phẩm 2",
      image: "https://example.com/images/product2.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 2. Sản phẩm có thiết kế hiện đại.",
      link: "#product2"
    },
    {
      id: 3,
      title: "Sản phẩm 3",
      image: "https://example.com/images/product3.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 3. Sản phẩm này rất đáng tin cậy.",
      link: "#product3"
    },
    {
      id: 4,
      title: "Sản phẩm 4",
      image: "https://example.com/images/product4.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 4. Sản phẩm này có giá trị tốt.",
      link: "#product4"
    },
    {
      id: 5,
      title: "Sản phẩm 5",
      image: "https://example.com/images/product5.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
      link: "#product5"
    },
    {
        id: 6,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 7,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 8,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 9,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 10,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 11,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 12,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 13,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 14,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 15,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 16,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 17,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 18,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 19,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 20,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 21,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 22,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
      {
        id: 23,
        title: "Sản phẩm 5",
        image: "https://example.com/images/product5.jpg",
        content: "Đây là mô tả chi tiết về sản phẩm 5. Sản phẩm này rất phổ biến.",
        link: "#product5"
      },
    {
      id: 24,
      title: "Sản phẩm 6",
      image: "https://example.com/images/product6.jpg",
      content: "Đây là mô tả chi tiết về sản phẩm 6. Sản phẩm này rất đa năng.",
      link: "#product6"
    }
  ];
  
  // Hàm cập nhật nội dung cho các card
  function updateCards() {
    // Lấy tất cả các phần tử card
    const cards = document.querySelectorAll('.card');
    
    // Kiểm tra xem có đủ dữ liệu cho tất cả các card không
    if (cards.length > cardData.length) {
      console.warn('Không đủ dữ liệu cho tất cả các card');
    }
    
    // Cập nhật từng card với dữ liệu tương ứng
    cards.forEach((card, index) => {
      // Kiểm tra xem có dữ liệu cho card này không
      if (index < cardData.length) {
        const data = cardData[index];
        
        // Cập nhật hình ảnh
        const img = card.querySelector('.card-img-top');
        if (img) {
          img.src = data.image;
          img.alt = data.title;
        }
        
        // Cập nhật tiêu đề
        const title = card.querySelector('.card-title');
        if (title) {
          title.textContent = data.title;
        }
        
        // Cập nhật nội dung
        const content = card.querySelector('.card-text');
        if (content) {
          content.textContent = data.content;
        }
        
        // Bọc card trong thẻ a để tạo liên kết
        const parent = card.parentNode;
        if (parent.tagName !== 'A') {
          const link = document.createElement('a');
          link.href = data.link;
          link.style.textDecoration = 'none';
          link.style.color = 'inherit';
          parent.appendChild(link);
          link.appendChild(card);
        }
      }
    });
  }
  
  // Gọi hàm cập nhật khi trang đã tải xong
  document.addEventListener('DOMContentLoaded', updateCards);
  
  // Hàm để thêm card mới vào giao diện
  function addCard(cardInfo) {
    // Thêm dữ liệu mới vào mảng cardData
    cardData.push(cardInfo);
    
    // Tạo phần tử card mới
    const cardContainer = document.querySelector('.row');
    
    const colDiv = document.createElement('div');
    colDiv.className = 'col';
    
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    
    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = cardInfo.image;
    img.alt = cardInfo.title;
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = cardInfo.title;
    
    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = cardInfo.content;
    
    // Ghép các phần tử lại với nhau
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    
    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBody);
    
    // Tạo liên kết
    const link = document.createElement('a');
    link.href = cardInfo.link;
    link.style.textDecoration = 'none';
    link.style.color = 'inherit';
    
    link.appendChild(cardDiv);
    colDiv.appendChild(link);
    
    // Thêm vào container
    cardContainer.appendChild(colDiv);
  }
  
  // Hàm để cập nhật dữ liệu của một card cụ thể
  function updateCardById(id, newData) {
    // Tìm vị trí của card trong mảng
    const index = cardData.findIndex(card => card.id === id);
    
    if (index !== -1) {
      // Cập nhật dữ liệu
      cardData[index] = { ...cardData[index], ...newData };
      
      // Cập nhật giao diện
      updateCards();
    } else {
      console.error(`Không tìm thấy card có id: ${id}`);
    }
  }