#!/bin/bash

echo "🗄️  IPTV Manager - Database Setup Script"
echo "=========================================="
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed!"
    echo ""
    echo "Install MySQL first:"
    echo "  Ubuntu/Debian: sudo apt-get install mysql-server"
    echo "  macOS: brew install mysql"
    echo "  CentOS/RHEL: sudo yum install mysql-server"
    exit 1
fi

echo "✅ MySQL is installed"
echo ""

# Prompt for MySQL credentials
read -p "Enter MySQL root username [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Enter MySQL password: " DB_PASSWORD
echo ""
echo ""

# Test MySQL connection
echo "Testing MySQL connection..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to MySQL. Check your credentials."
    exit 1
fi

echo "✅ MySQL connection successful"
echo ""

# Create database
echo "Creating database 'iptv_manager'..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS iptv_manager;" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "❌ Failed to create database"
    exit 1
fi

# Import schema
echo ""
echo "Importing database schema..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" iptv_manager < database/schema.sql 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Schema imported successfully"
else
    echo "❌ Failed to import schema"
    exit 1
fi

# Create .env file
echo ""
echo "Creating backend/.env file..."
cat > backend/.env << EOF
PORT=3001
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=iptv_manager
EOF

echo "✅ Backend configuration created"
echo ""

# Verify tables
echo "Verifying database tables..."
TABLES=$(mysql -u"$DB_USER" -p"$DB_PASSWORD" -D iptv_manager -e "SHOW TABLES;" 2>&1 | grep -v "Tables_in")

if [ -z "$TABLES" ]; then
    echo "❌ No tables found. Schema import may have failed."
    exit 1
fi

echo "✅ Found tables:"
echo "$TABLES" | sed 's/^/   - /'
echo ""

echo "=========================================="
echo "🎉 Database setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start the backend server:"
echo "   cd iptv-manager && bun run backend"
echo ""
echo "2. Start the frontend (if not running):"
echo "   cd iptv-manager && bun run dev"
echo ""
echo "3. Access the app at: http://localhost:5173"
echo ""
