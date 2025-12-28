# IPTV Manager - Customer & Subscription Management System

A professional IPTV business management system built with React, Node.js, Express, and MySQL.

## Features

✅ **Customer Management**
- Add, view, and manage customers
- Store contact info, location, and notes
- Track customer history

✅ **TV Box Inventory**
- Register TV boxes with serial numbers and MAC addresses
- Assign boxes to customers
- Track box status (active/replaced/returned)

✅ **Subscription Management**
- Create subscriptions with flexible duration (1, 3, 6, 12 months)
- Auto-calculate expiration dates
- Track active and expiring subscriptions

✅ **IPTV Credentials**
- Store IPTV server URLs, usernames, and passwords
- Copy credentials with one click
- Generate WhatsApp messages automatically

✅ **Dashboard Overview**
- Real-time stats
- Expiring subscriptions alerts
- Quick actions

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Routing**: React Router

## Setup Instructions

### 1. Database Setup

First, create the MySQL database:

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE iptv_manager;

# Use the database
USE iptv_manager;

# Run the schema
# Copy and paste the contents from database/schema.sql
```

Or run directly from terminal:
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=iptv_manager
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Run the Application

You need to run BOTH the frontend and backend:

**Terminal 1 - Frontend:**
```bash
bun run dev
```

**Terminal 2 - Backend:**
```bash
bun run backend
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Usage Guide

### Adding a Customer
1. Go to **Customers** page
2. Click **Add Customer**
3. Fill in name, phone, city, and notes
4. Click **Create Customer**

### Registering a TV Box
1. Go to **TV Boxes** page
2. Click **Add TV Box**
3. Select customer and enter box details
4. Click **Create TV Box**

### Creating a Subscription
1. Go to **Subscriptions** page
2. Click **Create Subscription**
3. Select customer, plan duration, and start date
4. Click **Create Subscription**

### Adding IPTV Credentials
1. Find the subscription
2. Click **Add Credentials**
3. Enter server URL, username, and password
4. Click **Save IPTV Credentials**

### Sending Credentials to Customer
- **Copy**: Click the copy icon to copy credentials
- **WhatsApp**: Click the WhatsApp icon to send directly

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### TV Boxes
- `GET /api/boxes` - Get all boxes
- `GET /api/boxes/customer/:customerId` - Get boxes by customer
- `POST /api/boxes` - Create box
- `PUT /api/boxes/:id` - Update box
- `DELETE /api/boxes/:id` - Delete box

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/active` - Get active subscriptions
- `GET /api/subscriptions/expiring` - Get expiring subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id/status` - Update subscription status
- `DELETE /api/subscriptions/:id` - Delete subscription

### IPTV Accounts
- `GET /api/iptv` - Get all IPTV accounts
- `GET /api/iptv/subscription/:subscriptionId` - Get by subscription
- `POST /api/iptv` - Create IPTV account
- `PUT /api/iptv/:id` - Update IPTV account
- `DELETE /api/iptv/:id` - Delete IPTV account
- `GET /api/iptv/whatsapp/:subscriptionId` - Get WhatsApp message

## Next Steps (Future Features)

### Phase 2
- [ ] API automation with IPTV panels (Xtream Codes)
- [ ] Auto-activation on subscription creation
- [ ] Email notifications
- [ ] PDF customer cards with QR codes

### Phase 3
- [ ] Reseller management
- [ ] Payment tracking
- [ ] Revenue analytics
- [ ] Box pre-configuration guides

### Phase 4
- [ ] Your own IPTV server setup
- [ ] Multi-server load balancing
- [ ] Channel management
- [ ] EPG integration

## Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env`
- Ensure database tables are created

### Frontend can't connect to backend
- Make sure backend is running on port 3001
- Check if CORS is enabled
- Verify API URL in `src/lib/api.ts`

### Database errors
- Ensure MySQL service is running
- Check if database `iptv_manager` exists
- Verify all tables are created

## Support

For questions or issues, contact your system administrator.

---

**Built with ❤️ for IPTV business owners in Morocco** 🇲🇦
# iptv-manager
# iptv-manager
