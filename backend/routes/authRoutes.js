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