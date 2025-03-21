-- Tạo bảng roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Chèn dữ liệu vào bảng roles
INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'Quản trị viên'),
(2, 'user', 'Người dùng thông thường');

-- Tạo bảng users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Tạo bảng cards
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    content TEXT,
    link TEXT
);

-- Tạo bảng chapters
CREATE TABLE chapters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    chapter_number INT NOT NULL,
    chapter_title VARCHAR(255),
    content TEXT,
    image_folder TEXT,
    image_count INT DEFAULT 0,
    rating FLOAT DEFAULT 0,
    comment_count INT DEFAULT 0,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    UNIQUE (card_id, chapter_number)
);
