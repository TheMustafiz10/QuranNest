# QuranNest - Complete Feature Guide

## 🎨 Visual Redesign Overview

The entire UI has been completely redesigned to match **QuranMazid.com** with a modern, clean three-column layout.

## ✨ New Features

### 1. Theme System (4 Themes)

#### Light Theme
- Bright white background (#ffffff)
- Dark gray text (#111827)
- Green accents (#10b981)
- Best for daytime reading
- Professional appearance

#### Dark Theme
- Deep slate background (#0f1419)
- Light text (#f8fafc)
- Emerald green accents (#10b981)
- Easy on the eyes for night reading
- Premium dark interface

#### Sepia Theme
- Warm cream background (#f5ede0)
- Dark brown text (#3e2723)
- Orange/tan accents (#c97c44)
- Mimics printed pages
- Comfortable for extended reading

#### System Theme
- Respects your OS preference
- Automatically switches light/dark
- Recommended for most users
- No persistent setting needed

### 2. Top Header
```
[Logo] [Search Bar] [Theme Switcher] [Settings]
```

Features:
- **QuranNest Logo** - Branded identity with gradient icon
- **Global Search Bar** - Quick access to search modal
- **Theme Buttons** - Light, Dark, Sepia, System toggle
- **Settings Button** - Future expansion for more options

### 3. Left Sidebar (Desktop Only)
- **Surah List** - All 114 chapters displayed
- **Live Search** - Filter by name or number
- **Visual Indicators** - Numbered circles (1-114)
- **Hover Effects** - Interactive feedback
- **Selected State** - Highlight current surah
- **Responsive** - Hidden on tablet/mobile

### 4. Main Content Area (Always Visible)
- **Chapter Header** - Arabic name + English title + verse count
- **Verse Display** - Large readable text
- **Arabic Text** - Configurable font (16-48px)
- **Translation** - English below Arabic with smaller font
- **Verse Numbers** - Right-aligned verse markers
- **Audio Button** - Play audio recitation per verse
- **Smooth Scrolling** - Navigate long chapters easily

### 5. Right Sidebar (Tablet & Desktop)

**Reading Tab** - Future reading preferences
**Translation Tab** - Future translation selection

**Settings Tab**:
- 📊 **Arabic Font Size Slider** - 16px to 48px
- 📊 **Translation Font Size Slider** - 12px to 24px
- 📊 **Line Height Slider** - 1.2 to 2.4
- 💾 Auto-saves settings to localStorage

### 6. Search Modal
- Appears at top of screen
- "Find wisdom in the Quran" header
- Search by surah name or number
- Recent navigation suggestions
- Theme-aware styling
- Click outside to close

## 🎯 User Workflows

### Reading a Surah
1. User opens app
2. Click on surah in left sidebar OR use search
3. Verses display in main area
4. Read with comfortable font sizes
5. Adjust settings in right sidebar

### Changing Theme
1. Click theme buttons in top header
2. Light, Dark, or Sepia icon
3. Theme changes instantly
4. Settings saved automatically

### Searching
1. Click search bar in header
2. Type surah name or number
3. Results appear instantly
4. Click result to navigate
5. Modal closes automatically

### Adjusting Reading Comfort
1. Open right sidebar settings
2. Use sliders to adjust:
   - Arabic font size
   - Translation font size
   - Line height
3. Changes apply in real-time
4. Settings persist on reload

## 📱 Responsive Behavior

### Mobile (< 640px)
- Top header visible
- Full-width main content
- No left sidebar (use search instead)
- No right sidebar (limited space)
- Simplified controls

### Tablet (640px - 1024px)
- Top header visible
- Full-width main content
- Left sidebar hidden
- Right sidebar visible

### Desktop (> 1024px)
- Top header visible
- Three-column layout
- Left sidebar visible (surah list)
- Main content in center
- Right sidebar visible (settings)

## 🎨 Theme Implementation

### CSS Variables Approach
```css
html[data-theme='light'] {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --accent-color: #10b981;
}
```

### Automatic Switching
- JavaScript detects theme preference
- Updates HTML data-attribute
- Tailwind CSS variables apply instantly
- Smooth transitions between themes

## 📦 File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css (theme colors)
│   │   ├── layout.tsx (theme provider)
│   │   └── reader/
│   │       └── page.tsx (main app)
│   ├── components/
│   │   ├── top-header.tsx (new)
│   │   ├── left-sidebar.tsx (new)
│   │   ├── right-sidebar.tsx (new)
│   │   ├── search-modal.tsx (new)
│   │   └── verse-display.tsx (updated)
│   ├── context/
│   │   └── theme-context.tsx (new)
│   ├── hooks/
│   │   └── useQuran.ts (updated)
│   └── types/
│       └── quran.ts (updated)
```

## 🔧 Configuration

### Font Settings
Located in `useQuran.ts`:
```typescript
const DEFAULT_FONT_SETTINGS = {
  arabicFont: 'kfgq',
  arabicFontSize: 28,
  translationFontSize: 16,
  lineHeight: 1.8
};
```

### Theme Colors
Located in `globals.css`:
- Customize colors per theme
- Adjust accent colors
- Modify border colors
- Update text colors

## 📝 Customization

### Adding a New Theme
1. Open `theme-context.tsx`
2. Add new theme type
3. Add case in switch statements
4. Define in `globals.css`

### Changing Default Theme
1. Edit `theme-context.tsx`
2. Modify `useState('system')` initial value
3. Change to 'light', 'dark', or 'sepia'

### Adjusting Colors
1. Edit `globals.css`
2. Modify `--bg-primary`, `--text-primary`, etc.
3. Changes apply across app instantly

## 🚀 Performance

- Lightweight CSS variable system
- No external theme libraries
- Minimal JavaScript overhead
- Fast theme switching
- Efficient localStorage usage

## ✅ Quality Assurance

All themes support:
- ✅ Readable text contrast
- ✅ Accessible color combinations
- ✅ Smooth transitions
- ✅ Fast performance
- ✅ Mobile responsive
- ✅ Desktop optimized

## 🎓 Development Tips

### Testing Themes
1. Open DevTools (F12)
2. Change `data-theme` attribute on HTML
3. See live theme changes
4. Test all color combinations

### localStorage Testing
- Check Application tab in DevTools
- View `quran-theme` key
- Clear to reset theme preference

### Font Size Testing
- Settings panel in right sidebar
- Adjust sliders in real-time
- Check responsive behavior

## 📚 Next Steps

1. Ensure backend returns required fields
2. Test with actual Quran data
3. Gather user feedback on themes
4. Fine-tune colors based on feedback
5. Add more customization options
6. Implement translation selection
