/*Bảng roles không có khóa ngoại*/
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    PRIMARY KEY (id),
    INDEX idx_name (name)
);

/*Bảng users có khóa ngoại role_id tham chiếu đến bảng roles*/
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    avatar VARCHAR(255),
    PRIMARY KEY (id),
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role_id (role_id),
    CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

/*Bảng genres không có khóa ngoại*/
CREATE TABLE genres (
    genre_id INT NOT NULL AUTO_INCREMENT,
    genre_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (genre_id),
    INDEX idx_genre_name (genre_name)
);

/*Bảng cards không có khóa ngoại trực tiếp trong sơ đồ này (mối quan hệ với chapters và card_genre sẽ được xử lý ở các bảng khác)*/
CREATE TABLE cards (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    content TEXT,
    link TEXT,
    hashtags TEXT,
    PRIMARY KEY (id)
);

/*Bảng card_genre là bảng trung gian để thể hiện quan hệ nhiều-nhiều giữa cards và genres*/
CREATE TABLE card_genre (
    card_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (card_id, genre_id),
    INDEX idx_genre_id (genre_id),
    CONSTRAINT fk_card_genre_card_id FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_card_genre_genre_id FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE ON UPDATE CASCADE
);

/*Bảng chapters có khóa ngoại card_id tham chiếu đến bảng cards*/
CREATE TABLE chapters (
    id INT NOT NULL AUTO_INCREMENT,
    chapter_number INT NOT NULL,
    chapter_title VARCHAR(255) NOT NULL,
    content TEXT,
    image_folder TEXT,
    image_count INT,
    rating FLOAT,
    comment_count INT,
    card_id INT NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_card_id (card_id),
    CONSTRAINT fk_chapters_card_id FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE ON UPDATE CASCADE
);

/*Câu lệnh SQL để tạo bảng favorites*/
CREATE TABLE favorites (
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    PRIMARY KEY (user_id, card_id),
    INDEX idx_card_id (card_id),
    CONSTRAINT fk_favorites_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_favorites_card_id FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE ON UPDATE CASCADE
);

/*Bảng reading_history để lưu lịch sử đọc truyện*/
CREATE TABLE reading_history (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    chapter_id INT NOT NULL,
    read_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_user_id (user_id),
    INDEX idx_card_id (card_id),
    INDEX idx_chapter_id (chapter_id),
    CONSTRAINT fk_reading_history_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reading_history_card_id FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reading_history_chapter_id FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE ON UPDATE CASCADE
);

/*Bảng ratings để lưu đánh giá của người dùng cho từng chương*/
CREATE TABLE ratings (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    chapter_id INT NOT NULL,
    rating INT NOT NULL, /*Đánh giá từ 1-5 sao*/
    rated_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_user_chapter (user_id, chapter_id), /*Mỗi người dùng chỉ đánh giá 1 lần cho mỗi chương*/
    INDEX idx_user_id (user_id),
    INDEX idx_chapter_id (chapter_id),
    CONSTRAINT fk_ratings_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ratings_chapter_id FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE ON UPDATE CASCADE
);

/*
Giải thích
- Khóa chính (PRIMARY KEY): Được định nghĩa cho từng bảng để đảm bảo tính duy nhất của mỗi bản ghi.
- Khóa ngoại (FOREIGN KEY): Được sử dụng để thiết lập mối quan hệ giữa các bảng, ví dụ role_id trong users tham chiếu đến id trong roles.
- Chỉ mục (INDEX): Được tạo để tối ưu hóa truy vấn, ví dụ idx_username trên cột username trong bảng users.
- ON DELETE và ON UPDATE: Được thiết lập để kiểm soát hành vi khi xóa hoặc cập nhật bản ghi trong bảng cha 
(ví dụ: ON DELETE CASCADE sẽ xóa các bản ghi liên quan trong bảng con nếu bản ghi trong bảng cha bị xóa).

Thứ tự tạo bảng
Vì có các mối quan hệ khóa ngoại, bạn cần tạo bảng theo thứ tự hợp lý:

1. roles và genres (không có khóa ngoại).
2. users (phụ thuộc vào roles).
3. cards (không có khóa ngoại trực tiếp).
4. card_genre (phụ thuộc vào cards và genres).
5. chapters (phụ thuộc vào cards).
6. reading_history (phụ thuộc vào users, cards và chapters).
*/