import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all IPTV accounts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, s.customer_id, c.name as customer_name
      FROM iptv_accounts i
      LEFT JOIN subscriptions s ON i.subscription_id = s.id
      LEFT JOIN customers c ON s.customer_id = c.id
      ORDER BY i.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get IPTV account by subscription ID
router.get('/subscription/:subscriptionId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM iptv_accounts WHERE subscription_id = ?', [req.params.subscriptionId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'IPTV account not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new IPTV account
router.post('/', async (req, res) => {
  try {
    const { subscription_id, server_url, username, password } = req.body;
    const [result] = await pool.query(
      'INSERT INTO iptv_accounts (subscription_id, server_url, username, password) VALUES (?, ?, ?, ?)',
      [subscription_id, server_url, username, password]
    );
    res.status(201).json({ id: result.insertId, message: 'IPTV account created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update IPTV account
router.put('/:id', async (req, res) => {
  try {
    const { server_url, username, password } = req.body;
    await pool.query(
      'UPDATE iptv_accounts SET server_url = ?, username = ?, password = ? WHERE id = ?',
      [server_url, username, password, req.params.id]
    );
    res.json({ message: 'IPTV account updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete IPTV account
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM iptv_accounts WHERE id = ?', [req.params.id]);
    res.json({ message: 'IPTV account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate WhatsApp message for IPTV credentials
router.get('/whatsapp/:subscriptionId', async (req, res) => {
  try {
    const [account] = await pool.query(`
      SELECT i.*, s.end_date, c.name as customer_name, c.phone
      FROM iptv_accounts i
      LEFT JOIN subscriptions s ON i.subscription_id = s.id
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE i.subscription_id = ?
    `, [req.params.subscriptionId]);

    if (account.length === 0) {
      return res.status(404).json({ error: 'IPTV account not found' });
    }

    const data = account[0];
    const message = `📡 *IPTV Subscription*\n\n` +
      `🔗 *Server:* ${data.server_url}\n` +
      `👤 *Username:* ${data.username}\n` +
      `🔑 *Password:* ${data.password}\n` +
      `📅 *Valid until:* ${new Date(data.end_date).toLocaleDateString()}\n\n` +
      `📞 *Support:* [Your Phone Number]`;

    res.json({ message, phone: data.phone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
