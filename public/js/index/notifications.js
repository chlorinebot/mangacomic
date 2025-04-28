// Khởi tạo các biến và elements
const notificationButton = document.getElementById('notificationsButton');
const notificationBadge = document.getElementById('notificationsBadge');
const notificationList = document.querySelector('.notification-list');
const markAllReadBtn = document.getElementById('markAllReadBtn');
const viewAllNotificationsBtn = document.getElementById('viewAllNotifications');

// Hàm để định dạng thời gian
function formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} năm trước`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} tháng trước`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} ngày trước`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} giờ trước`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} phút trước`;
    
    return 'Vừa xong';
}

// Hàm tạo HTML cho một thông báo
function createNotificationHTML(notification) {
    const isUnread = !notification.read ? 'unread' : '';
    let icon, content;
    
    // Xác định loại thông báo và nội dung tương ứng
    if (notification.card_id && !notification.comment_id) {
        // Thông báo về chương mới
        icon = '<i class="bi bi-book text-primary"></i>';
        content = `Truyện bạn theo dõi có chương mới: ${notification.content}`;
    } else if (notification.comment_id) {
        // Thông báo về phản hồi bình luận
        icon = '<i class="bi bi-chat-dots text-success"></i>';
        content = `Có người phản hồi bình luận của bạn: ${notification.content}`;
    }

    return `
        <div class="notification-item ${isUnread}" data-id="${notification.id}">
            <div class="d-flex align-items-center">
                <div class="me-3">
                    ${icon}
                </div>
                <div class="flex-grow-1">
                    <div class="notification-content">${content}</div>
                    <div class="notification-time">${formatTimeAgo(notification.received_at)}</div>
                </div>
                ${!notification.read ? '<div class="ms-2"><span class="badge bg-primary">Mới</span></div>' : ''}
            </div>
        </div>
    `;
}

// Hàm lấy thông báo từ server
async function fetchNotifications() {
    try {
        // Kiểm tra nếu người dùng chưa đăng nhập, không cần gọi API
        if (!isLoggedIn()) {
            // Ẩn badge và không hiển thị thông báo
            if (notificationBadge) notificationBadge.classList.add('d-none');
            if (notificationList) notificationList.innerHTML = '<div class="p-3 text-center text-muted">Vui lòng đăng nhập để xem thông báo</div>';
            return;
        }
        
        // Lấy user_id từ localStorage (giả sử user_id được lưu khi đăng nhập)
        const userId = localStorage.getItem('user_id');
        
        // Thêm user_id vào query string
        const response = await fetch(`/api/notifications${userId ? `?user_id=${userId}` : ''}`);
        
        if (!response.ok) {
            throw new Error(`Lỗi khi lấy thông báo: ${response.status} ${response.statusText}`);
        }
        
        const notifications = await response.json();
        
        // Cập nhật badge số lượng thông báo chưa đọc
        const unreadCount = notifications.filter(n => !n.read).length;
        if (unreadCount > 0 && notificationBadge) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.classList.remove('d-none');
            const bellIcon = notificationButton?.querySelector('.bi-bell');
            if (bellIcon) bellIcon.classList.add('bell-shake');
        } else if (notificationBadge) {
            notificationBadge.classList.add('d-none');
        }
        
        // Render thông báo
        if (notificationList) {
            notificationList.innerHTML = notifications.length > 0
                ? notifications.map(createNotificationHTML).join('')
                : '<div class="p-3 text-center text-muted">Không có thông báo mới</div>';
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
        if (notificationList) {
            notificationList.innerHTML = '<div class="p-3 text-center text-danger">Không thể tải thông báo</div>';
        }
    }
}

// Hàm đánh dấu thông báo đã đọc
async function markNotificationAsRead(notificationId) {
    if (!isLoggedIn()) {
        console.error('Người dùng chưa đăng nhập, không thể đánh dấu thông báo đã đọc');
        return;
    }
    
    try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`/api/notifications/${notificationId}/read?user_id=${userId}`, {
            method: 'PUT'
        });
        
        if (!response.ok) {
            throw new Error(`Lỗi khi cập nhật trạng thái thông báo: ${response.status} ${response.statusText}`);
        }
        
        // Cập nhật UI
        const notificationElement = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
        if (notificationElement) {
            notificationElement.classList.remove('unread');
            const badgeElement = notificationElement.querySelector('.badge');
            if (badgeElement) badgeElement.remove();
        }
        
        // Cập nhật lại số lượng thông báo chưa đọc
        if (notificationBadge && !notificationBadge.classList.contains('d-none')) {
            const unreadCount = parseInt(notificationBadge.textContent) - 1;
            if (unreadCount <= 0) {
                notificationBadge.classList.add('d-none');
                const bellIcon = notificationButton?.querySelector('.bi-bell');
                if (bellIcon) bellIcon.classList.remove('bell-shake');
            } else {
                notificationBadge.textContent = unreadCount;
            }
        }
    } catch (error) {
        console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
    }
}

// Hàm đánh dấu tất cả thông báo đã đọc
async function markAllNotificationsAsRead() {
    if (!isLoggedIn()) {
        console.error('Người dùng chưa đăng nhập, không thể đánh dấu thông báo đã đọc');
        return;
    }
    
    try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`/api/notifications/read-all?user_id=${userId}`, {
            method: 'PUT'
        });
        
        if (!response.ok) {
            throw new Error(`Lỗi khi cập nhật trạng thái thông báo: ${response.status} ${response.statusText}`);
        }
        
        // Cập nhật UI
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
            const badgeElement = item.querySelector('.badge');
            if (badgeElement) badgeElement.remove();
        });
        
        if (notificationBadge) {
            notificationBadge.classList.add('d-none');
            const bellIcon = notificationButton?.querySelector('.bi-bell');
            if (bellIcon) bellIcon.classList.remove('bell-shake');
        }
    } catch (error) {
        console.error('Lỗi khi đánh dấu tất cả thông báo đã đọc:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Lấy thông báo khi trang được tải
    if (isLoggedIn()) { // Giả sử có hàm isLoggedIn() để kiểm tra đăng nhập
        fetchNotifications();
    }
    
    // Đánh dấu đã đọc khi click vào thông báo
    notificationList.addEventListener('click', (e) => {
        const notificationItem = e.target.closest('.notification-item');
        if (notificationItem && notificationItem.classList.contains('unread')) {
            markNotificationAsRead(notificationItem.dataset.id);
        }
    });
    
    // Đánh dấu tất cả đã đọc
    markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    
    // Xem tất cả thông báo
    viewAllNotificationsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Thêm code để xem tất cả thông báo (có thể mở modal hoặc chuyển trang)
    });
});

// Kiểm tra thông báo mới định kỳ (mỗi 30 giây)
if (isLoggedIn()) {
    setInterval(fetchNotifications, 30000);
}

// WebSocket cho thông báo realtime (nếu có)
function initializeWebSocket() {
    try {
        // Kiểm tra nếu người dùng chưa đăng nhập, không cần kết nối WebSocket
        if (!isLoggedIn()) {
            return;
        }
        
        // Lấy WebSocket URL từ biến môi trường hoặc sử dụng URL mặc định
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.host;
        const wsUrl = `${wsProtocol}//${wsHost}/ws/notifications`;
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
            console.log('WebSocket connection established');
            // Gửi thông tin xác thực người dùng
            const userId = localStorage.getItem('user_id');
            if (userId) {
                ws.send(JSON.stringify({
                    type: 'auth',
                    user_id: userId
                }));
            }
        };
        
        ws.onmessage = (event) => {
            try {
                const notification = JSON.parse(event.data);
                if (notification.type === 'notification') {
                    // Thêm thông báo mới vào đầu danh sách
                    const notificationHTML = createNotificationHTML(notification.data);
                    if (notificationList) {
                        notificationList.insertAdjacentHTML('afterbegin', notificationHTML);
                    }
                    
                    // Cập nhật badge và hiệu ứng
                    if (notificationBadge) {
                        const currentCount = parseInt(notificationBadge.textContent) || 0;
                        notificationBadge.textContent = currentCount + 1;
                        notificationBadge.classList.remove('d-none');
                        const bellIcon = notificationButton?.querySelector('.bi-bell');
                        if (bellIcon) bellIcon.classList.add('bell-shake');
                    }
                }
            } catch (error) {
                console.error('Lỗi khi xử lý thông báo WebSocket:', error);
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        ws.onclose = (event) => {
            console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
            // Thử kết nối lại sau 5 giây nếu đóng không phải do lỗi nghiêm trọng
            if (event.code !== 1000 && event.code !== 1001) {
                setTimeout(initializeWebSocket, 5000);
            }
        };
        
        return ws;
    } catch (error) {
        console.error('Lỗi khi khởi tạo WebSocket:', error);
        return null;
    }
}

// Khởi tạo WebSocket nếu người dùng đã đăng nhập
let notificationWebSocket;
if (isLoggedIn()) {
    // Khởi tạo WebSocket sau khi trang đã tải xong
    document.addEventListener('DOMContentLoaded', () => {
        notificationWebSocket = initializeWebSocket();
    });
    
    // Đóng WebSocket khi trang được đóng
    window.addEventListener('beforeunload', () => {
        if (notificationWebSocket && notificationWebSocket.readyState === WebSocket.OPEN) {
            notificationWebSocket.close(1000, 'User left the page');
        }
    });
}