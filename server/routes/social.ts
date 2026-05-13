import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import pool from '../../database/db';

const router = Router();

/**
 * POST /api/posts/:id/like
 * Toggle like
 */
router.post('/:id/like', verifyToken, async (req: AuthRequest, res: Response) => {
    const postId = req.params.id;
    const userId = req.user?.id;

    try {
        const [existing]: any = await pool.query('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);

        if (existing.length > 0) {
            await pool.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
            return res.json({ success: true, message: 'Unliked', liked: false });
        } else {
            await pool.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
            return res.json({ success: true, message: 'Liked', liked: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/users/:id/follow
 * Toggle follow
 */
router.post('/users/:id/follow', verifyToken, async (req: AuthRequest, res: Response) => {
    const targetId = req.params.id;
    const userId = req.user?.id;

    if (userId === parseInt(targetId)) return res.status(400).json({ success: false, message: 'Cant follow yourself' });

    try {
        const [existing]: any = await pool.query('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?', [userId, targetId]);

        if (existing.length > 0) {
            await pool.query('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [userId, targetId]);
            return res.json({ success: true, message: 'Unfollowed' });
        } else {
            await pool.query('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [userId, targetId]);
            return res.json({ success: true, message: 'Followed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
