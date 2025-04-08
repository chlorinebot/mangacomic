-- Tạo bảng notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    comment_id INTEGER,
    chapter_id INTEGER,
    content TEXT NOT NULL,
    notification_type VARCHAR(50) CHECK (notification_type IN ('comment_reply', 'new_chapter')),
    is_read BOOLEAN DEFAULT FALSE,
    deleted BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE SET NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL
); 