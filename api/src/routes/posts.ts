import { Router } from 'express';
import { db } from '../db';
import type { Post, CreatePostData, UpdatePostData } from '../types';

const router = Router();

// Create post
router.post('/', async (req, res) => {
    const { title, body, userId }: CreatePostData = req.body;
    try {
        const result = await db.run(
            'INSERT INTO posts (title, body, userId) VALUES (?, ?, ?)',
            [title, body, userId]
        );
        const post: Post = {
            id: result.lastID ?? -1, // Using nullish coalescing instead of non-null assertion
            title,
            body,
            userId
        };
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Read all posts
router.get('/', async (req, res) => {
    try {
        const posts = await db.all<Post[]>('SELECT * FROM posts');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Read single post
router.get('/:id', async (req, res) => {
    try {
        const post = await db.get<Post>(
            'SELECT * FROM posts WHERE id = ?',
            req.params.id
        );
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Update post
router.put('/:id', async (req, res) => {
    const { title, body, userId }: UpdatePostData = req.body;
    try {
        const result = await db.run(
            'UPDATE posts SET title = ?, body = ?, userId = ? WHERE id = ?',
            [title, body, userId, req.params.id]
        );
        if (result.changes) {
            const post: Post = { id: Number.parseInt(req.params.id), title, body, userId };
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.run('DELETE FROM posts WHERE id = ?', req.params.id);
        console.log(result)
        if (result.changes) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

export default router;