// Ngăn bôi đen và sao chép văn bản
document.addEventListener('DOMContentLoaded', function () {
    // Vô hiệu hóa bôi đen văn bản
    document.body.style.userSelect = 'none'; // CSS ngăn bôi đen
    document.body.style.webkitUserSelect = 'none'; // Hỗ trợ trình duyệt Webkit
    document.body.style.MozUserSelect = 'none'; // Hỗ trợ Firefox
    document.body.style.msUserSelect = 'none'; // Hỗ trợ IE

    // Ngăn sự kiện sao chép
    document.addEventListener('copy', function (e) {
        e.preventDefault();
    });

    // Ngăn nhấp chuột phải (menu ngữ cảnh)
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Ngăn tổ hợp phím Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+P, PrintScreen
    document.addEventListener('keydown', function (e) {
        // Ngăn Ctrl+C (sao chép)
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
        }
        // Ngăn Ctrl+X (cắt)
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
        }
        // Ngăn Ctrl+V (dán)
        if (e.ctrlKey && e.key === 'v') {
            e.preventDefault();
        }
        // Ngăn Ctrl+P (in trang)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
        }
        // Ngăn phím PrintScreen (chụp màn hình)
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            alert('Chụp màn hình không được phép!');
            // Làm mờ nội dung khi nhấn PrintScreen
            document.body.style.filter = 'blur(10px)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 100);
        }
    });

    // Phát hiện khi người dùng cố gắng chụp màn hình bằng cách chuyển tab hoặc mất focus
    window.addEventListener('blur', function () {
        document.body.style.filter = 'blur(10px)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 500); // Làm mờ trong 0.5 giây
    });

    // Ngăn kéo thả văn bản
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });
});

// Thêm thông báo khi người dùng cố gắng in trang
window.onbeforeprint = function () {
    alert('In trang không được phép!');
    return false;
};