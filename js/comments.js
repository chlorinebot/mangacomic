function showComments(chapter) {
    // Tạo và hiển thị modal bình luận
    let commentModal = document.getElementById('commentModal');
    
    // Tạo modal nếu chưa tồn tại
    if (!commentModal) {
      commentModal = document.createElement('div');
      commentModal.className = 'modal fade';
      commentModal.id = 'commentModal';
      commentModal.setAttribute('tabindex', '-1');
      commentModal.setAttribute('aria-labelledby', 'commentModalLabel');
      commentModal.setAttribute('aria-hidden', 'true');
      
      const modalHTML = `
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="commentModalLabel">Bình luận</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="comments-container">
                <!-- Bình luận sẽ được thêm vào đây -->
              </div>
              <hr>
              <div class="comment-form mt-3">
                <h6>Thêm bình luận</h6>
                <div class="mb-3">
                  <label for="ratingInput" class="form-label">Đánh giá</label>
                  <div class="rating-input">
                    <i class="far fa-star" data-rating="1"></i>
                    <i class="far fa-star" data-rating="2"></i>
                    <i class="far fa-star" data-rating="3"></i>
                    <i class="far fa-star" data-rating="4"></i>
                    <i class="far fa-star" data-rating="5"></i>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="commentInput" class="form-label">Nội dung</label>
                  <textarea class="form-control" id="commentInput" rows="3"></textarea>
                </div>
                <button type="button" class="btn btn-primary" id="submitComment">Gửi bình luận</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      commentModal.innerHTML = modalHTML;
      document.body.appendChild(commentModal);
      
      // Xử lý chọn sao đánh giá
      const stars = commentModal.querySelectorAll('.rating-input i');
      stars.forEach(star => {
        star.addEventListener('click', function() {
          const rating = this.getAttribute('data-rating');
          // Reset tất cả các sao
          stars.forEach(s => s.className = 'far fa-star');
          // Đặt sao đã chọn và các sao trước đó
          for (let i = 0; i < rating; i++) {
            stars[i].className = 'fas fa-star text-warning';
          }
        });
        
        star.addEventListener('mouseover', function() {
          const rating = this.getAttribute('data-rating');
          // Hiển thị preview khi hover
          for (let i = 0; i < rating; i++) {
            stars[i].className = 'fas fa-star text-warning';
          }
        });
        
        star.addEventListener('mouseout', function() {
          // Khi không hover nữa, khôi phục trạng thái đã chọn hoặc mặc định
          stars.forEach(s => {
            if (s.classList.contains('selected')) {
              s.className = 'fas fa-star text-warning selected';
            } else {
              s.className = 'far fa-star';
            }
          });
        });
      });
      
      // Xử lý nút gửi bình luận
      const submitButton = commentModal.querySelector('#submitComment');
      submitButton.addEventListener('click', function() {
        const commentInput = commentModal.querySelector('#commentInput');
        const comment = commentInput.value.trim();
        const selectedRating = Array.from(stars).filter(s => s.classList.contains('fas')).length;
        
        // Kiểm tra nội dung bình luận không rỗng
        if (comment) {
          // Giả lập thêm bình luận mới vào container
          const commentsContainer = commentModal.querySelector('.comments-container');
          const newComment = document.createElement('div');
          newComment.className = 'comment border-bottom pb-3 mb-3';
          
          // Tạo sao bằng SVG cho bình luận mới
          let starsHTML = '';
          for (let i = 1; i <= 5; i++) {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffc107" class="bi ${i <= selectedRating ? 'bi-star-fill' : 'bi-star'}" viewBox="0 0 16 16">
              <path d="${i <= selectedRating ? 'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' : 'M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z'}"/>
            </svg>`;
            starsHTML += svg;
          }
          
          newComment.innerHTML = `
            <div class="d-flex align-items-center mb-2">
              <strong>Người dùng</strong>
              <span class="ms-2">${starsHTML} (${selectedRating}/5)</span>
              <small class="ms-auto text-muted">Vừa xong</small>
            </div>
            <p>${comment}</p>
            <button type="button" class="btn btn-outline-primary btn-sm reply-btn">Trả lời</button>
            <div class="reply-form mt-2" style="display: none;">
              <textarea class="form-control mb-2" rows="2" placeholder="Nhập câu trả lời..."></textarea>
              <button type="button" class="btn btn-primary btn-sm submit-reply">Gửi</button>
            </div>
          `;
          
          // Thêm bình luận mới lên đầu danh sách
          if (commentsContainer.firstChild) {
            commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
          } else {
            commentsContainer.appendChild(newComment);
          }
          
          // Xử lý nút trả lời
          newComment.querySelector('.reply-btn').addEventListener('click', function() {
            const replyForm = newComment.querySelector('.reply-form');
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
          });
          
          newComment.querySelector('.submit-reply').addEventListener('click', function() {
            const replyText = newComment.querySelector('.reply-form textarea').value.trim();
            if (replyText) {
              const reply = document.createElement('div');
              reply.className = 'reply ms-4 mt-2';
              reply.innerHTML = `<p><strong>Người dùng</strong>: ${replyText} <small class="text-muted">Vừa xong</small></p>`;
              newComment.appendChild(reply);
              newComment.querySelector('.reply-form').style.display = 'none';
              newComment.querySelector('.reply-form textarea').value = '';
            }
          });
          
          // Xóa nội dung sau khi gửi
          commentInput.value = '';
          stars.forEach(s => s.className = 'far fa-star');
        }
      });
    }
    
    // Cập nhật tiêu đề modal với tên chương
    const modalTitle = commentModal.querySelector('.modal-title');
    modalTitle.textContent = `Bình luận - Chương ${chapter.chapterNumber}: ${chapter.chapterTitle}`;
    
    // Hiển thị các bình luận mẫu
    const commentsContainer = commentModal.querySelector('.comments-container');
    commentsContainer.innerHTML = '';
    
    // Tạo một số bình luận mẫu dựa trên số lượng bình luận
    const sampleComments = [
      {
        username: "MangaFan123",
        rating: 5,
        content: "Chương này thật tuyệt vời! Tôi rất thích cách tác giả phát triển nhân vật.",
        time: "1 ngày trước"
      },
      {
        username: "OtakuMaster",
        rating: 4,
        content: "Cốt truyện đang rất hay, nhưng tôi nghĩ một số hình ảnh hành động hơi khó theo dõi.",
        time: "3 ngày trước"
      },
      {
        username: "TruyenTranh2024",
        rating: 5,
        content: "Không thể đợi đến chương tiếp theo! Cảm ơn vì đã dịch nhanh chóng.",
        time: "1 tuần trước"
      }
    ];
    
    // Tạo số lượng bình luận tương ứng
    const commentCount = Math.min(chapter.commentCount || 0, 10); // Giới hạn hiển thị tối đa 10 bình luận
    for (let i = 0; i < commentCount; i++) {
      const commentSample = sampleComments[i % sampleComments.length];
      const commentRating = commentSample.rating;
      
      const commentElement = document.createElement('div');
      commentElement.className = 'comment border-bottom pb-3 mb-3';
      
      // Tạo sao bằng SVG cho bình luận mẫu
      let starsHTML = '';
      for (let j = 1; j <= 5; j++) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffc107" class="bi ${j <= commentRating ? 'bi-star-fill' : 'bi-star'}" viewBox="0 0 16 16">
          <path d="${j <= commentRating ? 'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' : 'M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z'}"/>
        </svg>`;
        starsHTML += svg;
      }
      
      commentElement.innerHTML = `
        <div class="d-flex align-items-center mb-2">
          <strong>${commentSample.username}</strong>
          <span class="ms-2">${starsHTML} (${commentRating}/5)</span>
          <small class="ms-auto text-muted">${commentSample.time}</small>
        </div>
        <p>${commentSample.content}</p>
        <button type="button" class="btn btn-outline-primary btn-sm reply-btn">Trả lời</button>
        <div class="reply-form mt-2" style="display: none;">
          <textarea class="form-control mb-2" rows="2" placeholder="Nhập câu trả lời..."></textarea>
          <button type="button" class="btn btn-primary btn-sm submit-reply">Gửi</button>
        </div>
      `;
      
      commentsContainer.appendChild(commentElement);
      
      // Xử lý nút trả lời cho bình luận mẫu
      commentElement.querySelector('.reply-btn').addEventListener('click', function() {
        const replyForm = commentElement.querySelector('.reply-form');
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
      });
      
      commentElement.querySelector('.submit-reply').addEventListener('click', function() {
        const replyText = commentElement.querySelector('.reply-form textarea').value.trim();
        if (replyText) {
          const reply = document.createElement('div');
          reply.className = 'reply ms-4 mt-2';
          reply.innerHTML = `<p><strong>Người dùng</strong>: ${replyText} <small class="text-muted">Vừa xong</small></p>`;
          commentElement.appendChild(reply);
          commentElement.querySelector('.reply-form').style.display = 'none';
          commentElement.querySelector('.reply-form textarea').value = '';
        }
      });
    }
    
    // Hiển thị modal
    const bsCommentModal = new bootstrap.Modal(commentModal);
    bsCommentModal.show();
  }