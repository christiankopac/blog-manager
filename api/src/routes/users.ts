// src/routes/users.ts
import { Router } from 'express';
import { db } from '../db';
import type { User } from '../types';

const router = Router();

// Create user
router.post('/', async (req, res) => {
    const { name, email, username } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO users (name, email, username) VALUES (?, ?, ?)',
            [name, email, username]
        );
        const user: User = {
            id: result.lastID ?? -1, // Using nullish coalescing instead of non-null assertion
            name,
            email,
            username
        };
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Read all users
router.get('/', async (req, res) => {
    try {
        const users = await db.all<User[]>('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Read single user
router.get('/:id', async (req, res) => {
    try {
        const user = await db.get<User>(
            'SELECT * FROM users WHERE id = ?',
            req.params.id
        );
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    const { name, email, username } = req.body;
    try {
        const result = await db.run(
            'UPDATE users SET name = ?, email = ?, username = ? WHERE id = ?',
            [name, email, username, req.params.id]
        );
        if (result.changes) {
            const user: User = { id: parseInt(req.params.id), name, email, username };
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.run('DELETE FROM users WHERE id = ?', req.params.id);
        if (result.changes) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;