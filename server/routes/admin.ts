import { Router, Response } from 'express';
import { verifyToken, isAdmin, AuthRequest } from '../middleware/auth';
import pool from '../../database/db';

const router = Router();

/**
 * GET /api/admin/stats
 * Statistik dashboard admin
 */
router.get('/stats', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    try {
        const [[{ userCount }]]: any = await pool.query('SELECT COUNT(*) as userCount FROM users');
        const [[{ postCount }]]: any = await pool.query('SELECT COUNT(*) as postCount FROM posts');
        const [[{ reportCount }]]: any = await pool.query('SELECT COUNT(*) as reportCount FROM reports');

        res.json({
            success: true,
            data: { userCount, postCount, reportCount }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/admin/reports
 * Daftar laporan konten
 */
router.get('/reports', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    try {
        const [reports]: any = await pool.query(`
            SELECT r.*, u.username as reporter_name, p.content as post_content, p.image_url as post_image, author.username as post_author
            FROM reports r
            JOIN users u ON r.reporter_id = u.id
            JOIN posts p ON r.post_id = p.id
            JOIN users author ON p.user_id = author.id
            ORDER BY r.created_at DESC
        `);
        res.json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * PUT /api/admin/reports/:id/status
 * Update status laporan (resolved/ignored)
 */
router.put('/reports/:id/status', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE reports SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true, message: 'Status laporan diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/admin/users
 * Daftar semua user
 */
router.get('/users', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    try {
        const [users]: any = await pool.query('SELECT id, username, email, full_name, avatar, role, status, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * PUT /api/admin/users/:id/role
 * Update role user (user/admin)
 */
router.put('/users/:id/role', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    const { role } = req.body;
    try {
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ success: true, message: `Role user diperbarui menjadi ${role}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * DELETE /api/admin/users/:id
 * Hapus user secara permanen
 */
router.delete('/users/:id', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    try {
        // Cek jika user menghapus dirinya sendiri
        if (Number(req.params.id) === req.user?.id) {
            return res.status(400).json({ success: false, message: 'Anda tidak dapat menghapus akun Anda sendiri dari panel admin' });
        }
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'User berhasil dihapus secara permanen' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * PUT /api/admin/users/:id/status
 * Update status user (active/banned)
 */
router.put('/users/:id/status', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true, message: `Status user diperbarui menjadi ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/admin/posts
 * Daftar semua postingan untuk audit
 */
router.get('/posts', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    try {
        const [posts]: any = await pool.query(`
            SELECT p.*, u.username, u.avatar 
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC
        `);
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * DELETE /api/admin/posts/:id
 * Hapus postingan (Admin)
 */
router.delete('/posts/:id', [verifyToken, isAdmin], async (req: AuthRequest, res: Response) => {
    try {
        await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Postingan dihapus oleh Admin' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
