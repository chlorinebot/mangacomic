// Chặn mở DevTools bằng phím tắt và phát hiện khi DevTools được mở
document.addEventListener('DOMContentLoaded', function () {
    // Chặn các phím tắt phổ biến để mở DevTools
    document.addEventListener('keydown', function (e) {
        // Chặn F12
        if (e.key === 'F12') {
            e.preventDefault();
            alert('Mở DevTools không được phép!');
        }
        // Chặn Ctrl+Shift+I (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            alert('Mở DevTools không được phép!');
        }
        // Chặn Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            alert('Mở DevTools không được phép!');
        }
        // Chặn Ctrl+U (Xem mã nguồn)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            alert('Xem mã nguồn không được phép!');
        }
    });

    // Phát hiện khi DevTools được mở (phương pháp thay thế)
    function checkDevTools() {
        const threshold = 160; // Ngưỡng chênh lệch kích thước (thay đổi nếu cần)
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            // DevTools có thể đang mở
            document.body.innerHTML = '<h1 style="color: red; text-align: center;">Vui lòng đóng DevTools để tiếp tục sử dụng trang web!</h1>';
            // Hoặc chuyển hướng người dùng
            // window.location.href = 'about:blank';
        }
    }

    // Kiểm tra liên tục xem DevTools có mở không
    setInterval(checkDevTools, 1000);

    // Ngăn nhấp chuột phải (Inspect Element thường xuất hiện ở menu này)
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        alert('Nhấp chuột phải đã bị vô hiệu hóa!');
    });
});

// Vô hiệu hóa phím tắt bằng cách ghi đè
document.onkeydown = function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || (e.ctrlKey && e.key === 'u')) {
        return false;
    }
};