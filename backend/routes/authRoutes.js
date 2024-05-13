const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

router.post('/comments', async (req, res) => {
    const { user_id, content } = req.body;
    try {
        // 댓글 등록
        const newComment = await pool.query(
            "INSERT INTO comments (user_id, content, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *",
            [user_id, content]
        );
        res.json(newComment.rows[0]);
    } catch (err) {
        console.error("서버 오류:", err.message);
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


router.get('/comments', async (req, res) => {
    try {
        const allComments = await pool.query("SELECT * FROM comments");
        res.json(allComments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;
