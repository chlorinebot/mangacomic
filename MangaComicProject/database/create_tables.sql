-- Bảng chapters
CREATE TABLE chapters (
    id INT IDENTITY(1,1) PRIMARY KEY,
    comic_id INT NOT NULL,
    chapter_number INT NOT NULL,
    chapter_title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX),
    image_folder NVARCHAR(255),
    image_count INT DEFAULT 0,
    rating FLOAT DEFAULT 0.0,
    comment_count INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
);

-- Bảng comments
CREATE TABLE comments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    chapter_id INT NOT NULL,
    username NVARCHAR(50) NOT NULL,
    rating FLOAT NOT NULL,
    comment NVARCHAR(MAX) NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- Bảng replies
CREATE TABLE replies (
    id INT IDENTITY(1,1) PRIMARY KEY,
    comment_id INT NOT NULL,
    username NVARCHAR(50) NOT NULL,
    comment NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- Bảng users (tùy chọn nếu có hệ thống đăng nhập)
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);