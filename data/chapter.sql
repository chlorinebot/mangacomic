-- Sample data migration based on your existing JavaScript data

-- Insert genres
INSERT INTO Genres (genre_name) VALUES 
('Hành động'), ('Phiêu lưu'), ('Hài hước'), ('Trinh thám'), ('Viễn tưởng'), ('Siêu năng lực');

-- Insert comics/manga
INSERT INTO Comics (comic_id, title, author, cover_image_url, description, genre) VALUES
(1, '7 Viên Ngọc Rồng – Dragon Ball', 'Akira Toriyama', 
   'https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-7-vien-ngoc-rong-dragon-ball.jpg',
   'Câu chuyện kể về cuộc phiêu lưu của Son Goku trong hành trình tìm kiếm bảy viên ngọc rồng.',
   'Hành động, Phiêu lưu'),
(2, 'Đại Chiến Người Khổng Lồ - Attack On Titan - Mùa 1', 'Isayama Hajime',
   'https://resizing.flixster.com/SEKqvD_3s-g47nWx0tsZykurPvQ=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10873160_b_v8_aa.jpg',
   'Câu chuyện về cuộc chiến của nhân loại với người khổng lồ.',
   'Hành động, Viễn tưởng'),
(3, 'Conan Volume 1', 'Aoyama Gōshō',
   './banner_img/conan_v1.png',
   'Những vụ án li kì của thám tử trung học bị thu nhỏ thành cậu bé.',
   'Trinh thám, Hài hước'),
(4, 'Lạc Trôi', 'Nguyễn Huỳnh Bảo Châu',
   'https://pops-images-vn.akamaized.net/api/v2/containers/file2/cms_thumbnails/lactroi-01355878da52-1685600629917-s7qYv1Wa.png?v=0&maxW=420&format=webp',
   'Cuộc phiêu lưu trong thế giới kỳ ảo.',
   'Phiêu lưu, Viễn tưởng');

-- Insert comic-genre relationships
INSERT INTO Comic_Genres (comic_id, genre_id) VALUES
(1, 1), (1, 2), -- Dragon Ball: Hành động, Phiêu lưu
(2, 1), (2, 5), -- Attack on Titan: Hành động, Viễn tưởng
(3, 4), (3, 3), -- Conan: Trinh thám, Hài hước
(4, 2), (4, 5); -- Lạc Trôi: Phiêu lưu, Viễn tưởng

-- Insert sample users
INSERT INTO Users (username, email, password_hash, is_admin) VALUES
('admin', 'admin@example.com', 'hashed_password_here', TRUE),
('User1', 'user1@example.com', 'hashed_password_here', FALSE),
('User2', 'user2@example.com', 'hashed_password_here', FALSE),
('User3', 'user3@example.com', 'hashed_password_here', FALSE),
('User4', 'user4@example.com', 'hashed_password_here', FALSE),
('User5', 'user5@example.com', 'hashed_password_here', FALSE),
('User6', 'user6@example.com', 'hashed_password_here', FALSE),
('User7', 'user7@example.com', 'hashed_password_here', FALSE),
('User8', 'user8@example.com', 'hashed_password_here', FALSE);

-- Insert Dragon Ball chapters
INSERT INTO Chapters (comic_id, chapter_number, chapter_title, content, image_folder, image_count, rating) VALUES
(1, 1, 'Cuộc gặp gỡ với Bulma', 'Son Goku gặp Bulma và bắt đầu hành trình tìm ngọc rồng.', 'images/dragonball/chapter1', 3, 4.5),
(1, 2, 'Hành trình đầu tiên', 'Son Goku và Bulma đối mặt với những thử thách đầu tiên.', 'images/dragonball/chapter2', 2, 4.2);

-- Insert Attack on Titan chapters
INSERT INTO Chapters (comic_id, chapter_number, chapter_title, content, image_folder, image_count, rating) VALUES
(2, 1, 'Đến giờ, đã 2000 năm.', 'Mô tả nội dung chương 1 của sản phẩm 2.', './images/attackontitan/chapter1', 55, 4.8),
(2, 2, 'Ngày hôm đó', 'Nội dung chương 2 của sản phẩm 2.', './images/attackontitan/chapter2', 45, 4.6);

-- Insert Conan chapters
INSERT INTO Chapters (comic_id, chapter_number, chapter_title, content, image_folder, image_count, rating) VALUES
(3, 1, 'Viên thuốc độc', 'BLA BLA.', './images/conan/conan_v1/chapter1', 35, 4.7),
(3, 2, 'Thám tử thu nhỏ', 'ABC.', './images/conan/conan_v1/chapter2', 28, 4.5),
(3, 3, 'Thám tử bị cô lập', 'ABC.', './images/conan/conan_v1/chapter3', 16, 4.3),
(3, 4, 'Ống khói thứ sáu', 'ABC.', './images/conan/conan_v1/chapter4', 16, 4.4),
(3, 5, 'Thêm một trọng tội', 'ABC.', './images/conan/conan_v1/chapter5', 16, 4.6),
(3, 6, 'Từ thám tử gà mờ thành thám thử tài ba', 'ABC.', './images/conan/conan_v1/chapter6', 17, 4.8),
(3, 7, 'Thần tượng đẫm máu', 'ABC.', './images/conan/conan_v1/chapter7', 18, 4.9);

-- Insert Lạc Trôi chapters
INSERT INTO Chapters (comic_id, chapter_number, chapter_title, content, image_folder, image_count, rating) VALUES
(4, 1, 'Kẻ thù trong bóng tối', 'ABC.', 'https://pops-images-vn.akamaized.net/api/v2/containers/file2/cms_thumbnails/lactroi-01355878da52-1685600629917-s7qYv1Wa.png?v=0&maxW=420&format=webp', 16, 4.7);

-- Insert sample comments for Dragon Ball
INSERT INTO Comments (user_id, chapter_id, rating, comment_text, likes, dislikes) VALUES
(2, 1, 4.5, 'Truyện rất hay!', 10, 2),
(3, 1, 4.0, 'Cũng ổn.', 5, 1),
(4, 2, 4.2, 'Hành trình thú vị!', 8, 0);

-- Insert comment replies
INSERT INTO CommentReplies (comment_id, user_id, reply_text) VALUES
(1, 3, 'Đúng vậy!');

-- Insert sample comments for Attack on Titan
INSERT INTO Comments (user_id, chapter_id, rating, comment_text, likes, dislikes) VALUES
(5, 3, 4.8, 'Tuyệt vời!', 15, 3),
(6, 4, 4.6, 'Rất hấp dẫn!', 12, 2);

-- Insert sample comments for Conan
INSERT INTO Comments (user_id, chapter_id, rating, comment_text, likes, dislikes) VALUES
(7, 5, 4.7, 'Kịch tính!', 9, 1),
(8, 6, 4.5, 'Hay lắm!', 7, 0);