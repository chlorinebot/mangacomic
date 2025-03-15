-- Database schema for manga management system

-- Comics/Manga table - stores main comic information
CREATE TABLE Comics (
    comic_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    cover_image_url VARCHAR(512),
    description TEXT,
    genre VARCHAR(255),
    publication_date DATE,
    status VARCHAR(50), -- e.g., Ongoing, Completed, Hiatus
    rating DECIMAL(3,1),
    total_views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Chapters table - stores information about each chapter
CREATE TABLE Chapters (
    chapter_id INT PRIMARY KEY AUTO_INCREMENT,
    comic_id INT NOT NULL,
    chapter_number INT NOT NULL,
    chapter_title VARCHAR(255) NOT NULL,
    content TEXT,
    image_folder VARCHAR(512),
    image_count INT DEFAULT 0,
    rating DECIMAL(3,1) DEFAULT 0,
    view_count INT DEFAULT 0,
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comic_id) REFERENCES Comics(comic_id) ON DELETE CASCADE,
    UNIQUE (comic_id, chapter_number)
);

-- Users table - for user management
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_image VARCHAR(512),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Comments table - for storing user comments
CREATE TABLE Comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    chapter_id INT NOT NULL,
    rating DECIMAL(3,1),
    comment_text TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(chapter_id) ON DELETE CASCADE
);

-- Comment replies table - for nested replies
CREATE TABLE CommentReplies (
    reply_id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    reply_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES Comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Genres table - for categorizing comics
CREATE TABLE Genres (
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    genre_name VARCHAR(50) NOT NULL UNIQUE
);

-- Comic_Genres mapping table - many-to-many relationship
CREATE TABLE Comic_Genres (
    comic_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (comic_id, genre_id),
    FOREIGN KEY (comic_id) REFERENCES Comics(comic_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE CASCADE
);

-- Reading history table - tracks what users have read
CREATE TABLE ReadingHistory (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    chapter_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(chapter_id) ON DELETE CASCADE,
    UNIQUE (user_id, chapter_id)
);

-- Bookmarks table - for users to save comics
CREATE TABLE Bookmarks (
    bookmark_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    comic_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (comic_id) REFERENCES Comics(comic_id) ON DELETE CASCADE,
    UNIQUE (user_id, comic_id)
);