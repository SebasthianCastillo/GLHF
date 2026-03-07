# App Design System

## Direction & Feel

Modern dark theme inspired by YouTube with warm amber accents. Professional, clean, and easy on the eyes.

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0f0f0f` | Main screen background |
| Surface | `#272727` | Cards, elevated elements |
| Surface Light | `#3f3f3f` | Borders, dividers |
| Text Primary | `#ffffff` | Headings, primary content |
| Text Secondary | `#aaaaaa` | Labels, metadata |
| Accent Primary | `#F59E0B` | Primary actions, highlights (amber) |
| Success | `#2ba640` | Positive values, additions |
| Danger | `#ef4444` | Negative values, deletions |

## Spacing

- Base unit: 4px
- Card padding: 16px (p-4)
- Card margin: 12px (mb-3)
- Card border radius: 16px (rounded-2xl)
- Component gap: 12-24px

## Depth Strategy

- **Cards**: `bg-[#272727]` with subtle rounded corners
- **Dividers**: `border-[#3f3f3f]` - low opacity, defines structure without harsh lines
- **No shadows** - rely on color contrast for hierarchy

## Component Patterns

### Cards
- Background: `#272727`
- Border radius: `rounded-2xl` (16px)
- Padding: `p-4`
- Margin between cards: `mb-3`

### Buttons / Toggles
- Background: `#272727`
- Border radius: `rounded-lg` (8px)
- Text: white or accent color

### List Items
- Expandable items use `#272727` background
- "Today" highlight: `#F59E0B` accent
- Expanded content: slightly lighter/darker shade

### Summary Cards
- Translucent backgrounds: `bg-[color]/10`
- Border: `border-[color]/20`
- Large bold numbers with small uppercase labels

### Empty States
- Icon container: `#272727` circle
- Icon color: `#aaaaaa`
- Message: `#aaaaaa` text

## Typography

- Headings: white, bold
- Body: white/gray
- Labels: secondary gray (`#aaaaaa`), smaller size
- Numbers in cards: bold, colored by semantic meaning

## Common Patterns

### Header
```
View: bg-[#0f0f0f], border-b border-[#3f3f3f]
Title: text-white, font-bold
Actions: px-4 py-2 bg-[#272727] rounded-lg
```

### Card Item
```
Container: bg-[#272727] rounded-2xl p-4
Left: Icon/Badge with accent background
Center: Title + subtitle
Right: Value/Action
```

### Month/Date Selector
```
Container: bg-[#272727] rounded-xl
Arrows: text-[#F59E0B] text-3xl (no background)
Label: text-white font-semibold
```

### Transaction Row
```
Added: bg-[#2ba640]/10, text-[#2ba640]
Removed: bg-red-500/10, text-red-500
Format: text-white/80
Time: text-[#aaaaaa]
```
