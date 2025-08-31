#!/bin/bash

# UI Components Refactoring Script
# This script reorganizes the UI components into logical categories

echo "🚀 Starting UI Components Refactoring..."

# Create new directory structure
echo "📁 Creating new directory structure..."
mkdir -p src/components/ui/{core,layout,theme,dracula,icons,utilities,navigation}

# Move core components
echo "📦 Moving core components..."
mv src/components/ui/avatar.tsx src/components/ui/core/ 2>/dev/null
mv src/components/ui/button.tsx src/components/ui/core/ 2>/dev/null
mv src/components/ui/input.tsx src/components/ui/core/ 2>/dev/null
mv src/components/ui/label.tsx src/components/ui/core/ 2>/dev/null

# Move layout components
echo "📦 Moving layout components..."
mv src/components/ui/dialog.tsx src/components/ui/layout/ 2>/dev/null
mv src/components/ui/dropdown-menu.tsx src/components/ui/layout/ 2>/dev/null
mv src/components/ui/form.tsx src/components/ui/layout/ 2>/dev/null

# Move theme components
echo "📦 Moving theme components..."
mv src/components/ui/theme-toggle.tsx src/components/ui/theme/ 2>/dev/null
mv src/components/ui/dracula-theme-toggle.tsx src/components/ui/theme/ 2>/dev/null

# Move dracula components
echo "📦 Moving dracula components..."
mv src/components/ui/dracula-button.tsx src/components/ui/dracula/ 2>/dev/null
mv src/components/ui/dracula-card.tsx src/components/ui/dracula/ 2>/dev/null

# Move icon components
echo "📦 Moving icon components..."
mv src/components/ui/x-icon.tsx src/components/ui/icons/ 2>/dev/null
mv src/components/ui/x-icon.css src/components/ui/icons/ 2>/dev/null
mv src/components/ui/custom-icons.tsx src/components/ui/icons/ 2>/dev/null

# Move utility components
echo "📦 Moving utility components..."
mv src/components/ui/client-only.tsx src/components/ui/utilities/ 2>/dev/null
mv src/components/ui/sonner.tsx src/components/ui/utilities/ 2>/dev/null

# Move navigation components
echo "📦 Moving navigation components..."
mv src/components/ui/user-dropdown.tsx src/components/ui/navigation/ 2>/dev/null

echo "✅ File reorganization completed!"
echo ""
echo "📋 New structure created:"
echo "src/components/ui/"
echo "├── core/           # Core UI components"
echo "├── layout/         # Layout components"
echo "├── theme/          # Theme components"
echo "├── dracula/        # Dracula theme components"
echo "├── icons/          # Custom icons"
echo "├── utilities/      # Utility components"
echo "├── navigation/     # Navigation components"
echo "└── index.ts        # Main export file"
echo ""
echo "🔧 Next steps:"
echo "1. Update import statements in your components"
echo "2. Test the build to ensure everything works"
echo "3. Update any documentation or README files"
echo ""
echo "📖 See REFACTOR_UI_STRUCTURE.md for detailed migration guide"
echo "🔄 To rollback, run: ./rollback-ui.sh"
