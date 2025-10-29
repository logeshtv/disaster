#!/bin/bash

echo "🚀 Setting up Disaster Relief System - Frontend"
echo "=============================================="
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check Node version
echo "📌 Checking Node.js version..."
node --version
npm --version

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    echo "VITE_API_URL=http://localhost:5000" > .env
fi

echo ""
echo "=============================================="
echo "✅ Frontend setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure backend is running on port 5000"
echo "2. Run: npm run dev"
echo ""
echo "Frontend will run on http://localhost:5173"
echo "=============================================="
