import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, c.name as customer_name, c.phone as customer_phone,
             b.model as box_model
      FROM subscriptions s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN tv_boxes b ON s.box_id = b.id
      ORDER BY s.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active subscriptions
router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, c.name as customer_name, c.phone as customer_phone
      FROM subscriptions s
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.status = 'active' AND s.end_date >= date('now')
      ORDER BY s.end_date ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expiring subscriptions (within 7 days)
router.get('/expiring', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, c.name as customer_name, c.phone as customer_phone
      FROM subscriptions s
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.status = 'active'
        AND s.end_date BETWEEN date('now') AND date('now', '+7 days')
      ORDER BY s.end_date ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subscription by customer ID
router.get('/customer/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subscriptions WHERE customer_id = ?', [req.params.customerId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new subscription
router.post('/', async (req, res) => {
  try {
    const { customer_id, box_id, plan_duration, start_date, price } = req.body;

    // Calculate end_date based on plan_duration
    const startDate = new Date(start_date);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(plan_duration));

    const [result] = await pool.query(
      'INSERT INTO subscriptions (customer_id, box_id, plan_duration, start_date, end_date, price) VALUES (?, ?, ?, ?, ?, ?)',
      [customer_id, box_id, plan_duration, start_date, endDate.toISOString().split('T')[0], price]
    );
    res.status(201).json({ id: result.insertId, message: 'Subscription created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subscription status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE subscriptions SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Subscription status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM subscriptions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
