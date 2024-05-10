const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');

router.post('/comments', async (req, res) => {
    const { username, password, content } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) {
            return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
        }

        const vaildPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!vaildPassword) {
            return res.status(401).json({ message: '유효하지 않은 비밀번호입니다.' });
        }

        const newComment = await pool.query("INSERT INTO comments (user_id, content, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *", [user.rows[0].id, content]);

        res.json(newComment.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

router.put('/comments/:id', async (req, res) => {
    const { content } = req.body;
    const { id } = req.params;
    try {
        const updatedComment = await pool.query("UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *", [content, id]);
        if (updatedComment.rows.length === 0) {
            return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
        }
        res.json(updatedComment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

router.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedComment = await pool.query("DELETE FROM comments WHERE id = $1 RETURNING *", [id]);

        if (deletedComment.rows.length === 0) {
            res.json({ message: '댓글이 삭제되었습니다.' });
        }
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