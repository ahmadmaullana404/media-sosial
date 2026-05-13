import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import pool from '../../database/db';
import multer from 'multer';

const router = Router();
const storage = multer.diskStorage({
    destination: './uploads/posts/',
    filename: (req, file, cb) => {
        cb(null, `post-${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

/**
 * POST /api/posts
 * Buat postingan baru
 */
router.post('/', verifyToken, upload.single('image'), async (req: AuthRequest, res: Response) => {
    const { content } = req.body;
    const imageUrl = req.file ? `/uploads/posts/${req.file.filename}` : null;

    try {
        const [result]: any = await pool.query(
            'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
            [req.user?.id, content, imageUrl]
        );
        res.json({ success: true, data: { id: result.insertId }, message: 'Postingan berhasil dibuat' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/posts/feed
 * Timeline feed (Post dari orang yang difollow)
 */
router.get('/feed', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        // Mengambil postingan dari semua user agar platform terasa ramai (Global Feed)
        // Dulu: hanya orang yang difollow. Sekarang: Global + ditandai jika itu dari user sendiri
        const [posts]: any = await pool.query(`
            SELECT p.*, u.username, u.avatar,
                   (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as isLiked,
                   (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as commentCount
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
            LIMIT 100
        `, [req.user?.id]);

        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/posts/:id/comments
 * Ambil semua komentar untuk satu postingan
 */
router.get('/:id/comments', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const [comments]: any = await pool.query(`
            SELECT c.*, u.username, u.avatar 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.post_id = ? 
            ORDER BY c.created_at ASC
        `, [req.params.id]);
        res.json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/posts/:id/comments
 * Tambah komentar
 */
router.post('/:id/comments', verifyToken, async (req: AuthRequest, res: Response) => {
    const { content } = req.body;
    try {
        await pool.query(
            'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
            [req.user?.id, req.params.id, content]
        );
        res.json({ success: true, message: 'Komentar ditambahkan' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
