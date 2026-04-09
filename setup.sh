# Digital Gift Box Generator - Setup Script

echo "========================================="
echo "  Digital Gift Box Generator - Setup"
echo "========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Please install Node.js from: https://nodejs.org"
    echo "   Recommended: LTS version (18.x or higher)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Navigate to project directory
cd "$(dirname "$0")"

echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================="
echo "  Configuration Required"
echo "========================================="

echo ""
echo "1. Create a Supabase project:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Copy your URL and anon key"

echo ""
echo "2. Create a Cloudinary account:"
echo "   - Go to https://cloudinary.com"
echo "   - Copy your cloud name and API keys"

echo ""
echo "3. Create .env.local file with your credentials:"
echo "   cp .env.example .env.local"

echo ""
echo "4. Run the database schema in Supabase SQL Editor:"
echo "   - Copy the contents of supabase/schema.sql"
echo "   - Run it in your Supabase project's SQL Editor"

echo ""
echo "5. Start the development server:"
echo "   npm run dev"

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="

