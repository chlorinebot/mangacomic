document.addEventListener('DOMContentLoaded', function () {
    // Lưu trữ nội dung ban đầu của trang
    const originalContent = document.body.innerHTML;

    // Chặn các phím tắt phổ biến để mở DevTools
    document.addEventListener('keydown', function (e) {
        // Chặn F12
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Chặn Ctrl+Shift+I (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
        }
        // Chặn Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
        }
        // Chặn Ctrl+Shift+M (Toggle Device Toolbar)
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            e.preventDefault();
        }
        // Chặn Ctrl+U (Xem mã nguồn)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
        }
    });

    // Phát hiện DevTools và Toggle Device Toolbar
    function checkDevToolsAndDeviceMode() {
        const threshold = 160; // Ngưỡng chênh lệch kích thước
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        // Kiểm tra kích thước viewport để phát hiện Toggle Device Toolbar
        const isDeviceMode = window.innerWidth !== document.documentElement.clientWidth || 
                            window.innerHeight !== document.documentElement.clientHeight;

        if (widthThreshold || heightThreshold || isDeviceMode) {
            // DevTools hoặc Device Mode đang mở
            if (document.body.innerHTML !== '<h1 style="color: red; text-align: center;">Vui lòng đóng DevTools hoặc chế độ mô phỏng thiết bị để tiếp tục sử dụng trang web!</h1>') {
                document.body.innerHTML = '<h1 style="color: red; text-align: center;">Vui lòng đóng DevTools hoặc chế độ mô phỏng thiết bị để tiếp tục sử dụng trang web!</h1>';
            }
        } else {
            // DevTools và Device Mode đã đóng, khôi phục nội dung ban đầu
            if (document.body.innerHTML === '<h1 style="color: red; text-align: center;">Vui lòng đóng DevTools hoặc chế độ mô phỏng thiết bị để tiếp tục sử dụng trang web!</h1>') {
                document.body.innerHTML = originalContent;
                reattachEventListeners();
            }
        }
    }

    // Hàm gắn lại các sự kiện
    function reattachEventListeners() {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'M')) || 
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
            }
        });
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    }

    // Kiểm tra liên tục
    setInterval(checkDevToolsAndDeviceMode, 1000);

    // Ngăn nhấp chuột phải
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Phát hiện thay đổi kích thước viewport (có thể do Toggle Device Toolbar)
    window.addEventListener('resize', function () {
        checkDevToolsAndDeviceMode();
    });
});

// Vô hiệu hóa phím tắt bằng cách ghi đè
document.onkeydown = function (e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'M')) || 
        (e.ctrlKey && e.key === 'u')) {
        return false;
    }
};