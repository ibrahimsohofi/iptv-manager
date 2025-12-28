import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all boxes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as customer_name, c.phone as customer_phone
      FROM tv_boxes b
      LEFT JOIN customers c ON b.customer_id = c.id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get boxes by customer ID
router.get('/customer/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tv_boxes WHERE customer_id = ?', [req.params.customerId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new box
router.post('/', async (req, res) => {
  try {
    const { customer_id, model, serial_number, mac_address, status } = req.body;
    const [result] = await pool.query(
      'INSERT INTO tv_boxes (customer_id, model, serial_number, mac_address, status) VALUES (?, ?, ?, ?, ?)',
      [customer_id, model, serial_number, mac_address, status || 'active']
    );
    res.status(201).json({ id: result.insertId, message: 'TV Box created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update box
router.put('/:id', async (req, res) => {
  try {
    const { model, serial_number, mac_address, status } = req.body;
    await pool.query(
      'UPDATE tv_boxes SET model = ?, serial_number = ?, mac_address = ?, status = ? WHERE id = ?',
      [model, serial_number, mac_address, status, req.params.id]
    );
    res.json({ message: 'TV Box updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete box
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tv_boxes WHERE id = ?', [req.params.id]);
    res.json({ message: 'TV Box deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
