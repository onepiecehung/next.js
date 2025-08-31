#!/bin/bash

# UI Components Rollback Script
# This script restores the original flat structure if issues arise

echo "🔄 Starting UI Components Rollback..."

# Move files back to root ui directory
echo "📦 Moving files back to root..."

# Core components
echo "📦 Restoring core components..."
mv src/components/ui/core/avatar.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/core/button.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/core/input.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/core/label.tsx src/components/ui/ 2>/dev/null

# Layout components
echo "📦 Restoring layout components..."
mv src/components/ui/layout/dialog.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/layout/dropdown-menu.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/layout/form.tsx src/components/ui/ 2>/dev/null

# Theme components
echo "📦 Restoring theme components..."
mv src/components/ui/theme/theme-toggle.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/theme/dracula-theme-toggle.tsx src/components/ui/ 2>/dev/null

# Dracula components
echo "📦 Restoring dracula components..."
mv src/components/ui/dracula/dracula-button.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/dracula/dracula-card.tsx src/components/ui/ 2>/dev/null

# Icon components
echo "📦 Restoring icon components..."
mv src/components/ui/icons/x-icon.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/icons/x-icon.css src/components/ui/ 2>/dev/null
mv src/components/ui/icons/custom-icons.tsx src/components/ui/ 2>/dev/null

# Utility components
echo "📦 Restoring utility components..."
mv src/components/ui/utilities/client-only.tsx src/components/ui/ 2>/dev/null
mv src/components/ui/utilities/sonner.tsx src/components/ui/ 2>/dev/null

# Navigation components
echo "📦 Restoring navigation components..."
mv src/components/ui/navigation/user-dropdown.tsx src/components/ui/ 2>/dev/null

# Remove empty directories
echo "🗑️ Removing empty directories..."
rmdir src/components/ui/core 2>/dev/null
rmdir src/components/ui/layout 2>/dev/null
rmdir src/components/ui/theme 2>/dev/null
rmdir src/components/ui/dracula 2>/dev/null
rmdir src/components/ui/icons 2>/dev/null
rmdir src/components/ui/utilities 2>/dev/null
rmdir src/components/ui/navigation 2>/dev/null

# Remove refactored index files
echo "🗑️ Removing refactored index files..."
rm src/components/ui/index.ts 2>/dev/null

echo "✅ Rollback completed!"
echo ""
echo "📋 Original structure restored:"
echo "src/components/ui/"
echo "├── avatar.tsx"
echo "├── button.tsx"
echo "├── input.tsx"
echo "├── label.tsx"
echo "├── dialog.tsx"
echo "├── dropdown-menu.tsx"
echo "├── form.tsx"
echo "├── theme-toggle.tsx"
echo "├── dracula-theme-toggle.tsx"
echo "├── dracula-button.tsx"
echo "├── dracula-card.tsx"
echo "├── x-icon.tsx"
echo "├── x-icon.css"
echo "├── custom-icons.tsx"
echo "├── client-only.tsx"
echo "├── sonner.tsx"
echo "└── user-dropdown.tsx"
echo ""
echo "🔧 Next steps:"
echo "1. Update import statements back to original paths"
echo "2. Test the build to ensure everything works"
echo "3. Remove any refactoring documentation"
