#!/bin/bash

# GuestPostHub - Create Download Package
# This script creates a clean ZIP file ready for download

echo "🚀 Creating GuestPostHub download package..."
echo ""

# Create zip excluding heavy folders
zip -r guestposthub-complete.zip . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "dist/*" \
  -x ".convex/_generated/*" \
  -x "*.log" \
  -x ".env.local" \
  -x ".DS_Store"

echo ""
echo "✅ Download package created: guestposthub-complete.zip"
echo ""
echo "📦 Package includes:"
echo "   ✓ Full source code"
echo "   ✓ All backend functions"
echo "   ✓ UI components"
echo "   ✓ Sample data seeder"
echo "   ✓ Complete documentation"
echo ""
echo "📝 Next steps:"
echo "   1. Extract the ZIP file"
echo "   2. Run: pnpm install"
echo "   3. Run: npx convex dev"
echo "   4. Run: npx convex run seedData:seed"
echo "   5. Run: pnpm dev"
echo ""
echo "📚 See QUICK_START.md for detailed setup instructions"
echo ""
echo "🎉 Your code is ready to download!"
