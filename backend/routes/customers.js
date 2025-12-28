import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID with all related data
router.get('/:id', async (req, res) => {
  try {
    const [customer] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    const [boxes] = await pool.query('SELECT * FROM tv_boxes WHERE customer_id = ?', [req.params.id]);
    const [subscriptions] = await pool.query('SELECT * FROM subscriptions WHERE customer_id = ?', [req.params.id]);

    if (customer.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      ...customer[0],
      boxes,
      subscriptions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, phone, city, notes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO customers (name, phone, city, notes) VALUES (?, ?, ?, ?)',
      [name, phone, city, notes]
    );
    res.status(201).json({ id: result.insertId, message: 'Customer created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, city, notes } = req.body;
    await pool.query(
      'UPDATE customers SET name = ?, phone = ?, city = ?, notes = ? WHERE id = ?',
      [name, phone, city, notes, req.params.id]
    );
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
