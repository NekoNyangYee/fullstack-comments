const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

router.post('/comments', async (req, res) => {
    const { username, password, content } = req.body;
    try {
        let user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await pool.query(
                "INSERT INTO users (username, password, created_at) VALUES ($1, $2, NOW()) RETURNING *",
                [username, hashedPassword]
            );
        }

        const newComment = await pool.query(
            "INSERT INTO comments (user_id, content, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *",
            [user.rows[0].id, content]
        );

        const commentWithUsername = {
            ...newComment.rows[0],
            username: user.rows[0].username
        };

        res.json({ message: '댓글이 등록되었습니다.', data: commentWithUsername });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

router.put('/comments/:id', async (req, res) => {
    const { content, password } = req.body;
    const { id } = req.params;
    try {
        const comment = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
        if (comment.rows.length === 0) {
            return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
        }

        const user = await pool.query("SELECT * FROM users WHERE id = $1", [comment.rows[0].user_id]);
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: '유효하지 않은 비밀번호입니다.' });
        }

        const updatedComment = await pool.query(
            "UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
            [content, id]
        );
        res.json(updatedComment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 댓글 삭제 라우터
router.delete('/comments/:id', async (req, res) => {
    const { password } = req.body;
    const { id } = req.params;
    try {
        const comment = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
        if (comment.rows.length === 0) {
            return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
        }

        const user = await pool.query("SELECT * FROM users WHERE id = $1", [comment.rows[0].user_id]);
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: '유효하지 않은 비밀번호입니다.' });
        }

        const deletedComment = await pool.query("DELETE FROM comments WHERE id = $1 RETURNING *", [id]);
        res.json({ message: '댓글이 삭제되었습니다.', comment: deletedComment.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 모든 댓글 조회 라우터
router.get('/comments', async (req, res) => {
    try {
        const comments = await pool.query(
            `SELECT comments.*, users.username 
            FROM comments 
            JOIN users ON comments.user_id = users.id`
        );
        res.json(comments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;
