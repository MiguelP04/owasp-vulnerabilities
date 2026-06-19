import { Router } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.query.user_id || req.user.id;
        const result = await pool.query(`SELECT * FROM todos WHERE user_id = ${userId} ORDER BY created_at DESC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.body.user_id || req.user.id;
        const result = await pool.query(
            `INSERT INTO todos (user_id, text) VALUES (${userId}, '${text}') RETURNING *`
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `UPDATE todos SET completed = NOT completed WHERE id = ${id} RETURNING *`
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM todos WHERE id = ${id} RETURNING *`);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json({ message: 'Tarea eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
