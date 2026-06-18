---
name: Aureus Light
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#4f4535'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#817563'
  outline-variant: '#d3c4af'
  surface-tint: '#7b5800'
  primary: '#785600'
  on-primary: '#ffffff'
  primary-container: '#986d00'
  on-primary-container: '#fffbff'
  inverse-primary: '#f7bd48'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#5b5c60'
  on-tertiary: '#ffffff'
  tertiary-container: '#747479'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea6'
  primary-fixed-dim: '#f7bd48'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5d4200'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#e3e2e7'
  tertiary-fixed-dim: '#c7c6cb'
  on-tertiary-fixed: '#1a1b20'
  on-tertiary-fixed-variant: '#46464b'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style
This design system embodies a "High-Wealth Professional" aesthetic, blending corporate reliability with a luxury financial atmosphere. The personality is authoritative yet approachable, prioritizing clarity and prestige.

The design style is a hybrid of **Minimalism** and **Glassmorphism**. It utilizes expansive white space (the "Aureus" void) to signify premium quality, accented by soft, white-based frosted glass elements. This creates a sense of layered depth and transparency, mimicking high-end physical environments like private banking lounges or luxury architectural glass.

## Colors
The palette is rooted in a pristine white foundation to evoke cleanliness and order. 

- **Primary & Secondary:** A range of Luxury Gold tones. Use the deeper `#B8860B` for interactive states and primary actions to ensure contrast, and the brighter `#FFD700` for decorative borders and subtle highlights.
- **Neutrals:** Soft off-whites and light grays form the container system, ensuring the UI feels layered rather than flat.
- **Typography:** High-contrast charcoal and near-black are used exclusively for text to maintain institutional legibility standards.

## Typography
The typography strategy balances modern precision with technical authority.

- **Headlines:** `manrope` provides a refined, balanced structure that feels contemporary and trustworthy.
- **Body:** `inter` is utilized for its supreme legibility in data-dense financial environments.
- **Technical Labels:** `jetbrainsMono` is used for currency codes, timestamps, and data values to provide a "Bloomberg-esque" technical precision.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to maintain a controlled, editorial feel, transitioning to a **Fluid Grid** for mobile devices.

- **Desktop:** 12-column grid with a 1200px max-width.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing is generous. Use the `lg` and `xl` units to separate major content sections, creating the "luxury of space" effect typical of premium brands.

## Elevation & Depth
Depth is achieved through **White Glassmorphism** and subtle **Tonal Layering** rather than heavy shadows.

- **Surface 1 (Base):** `#FFFFFF` pure white.
- **Surface 2 (Cards):** `#F8F9FA` with a 1px border of `#F1F3F5`.
- **Surface 3 (Overlays):** White-based glass (RGBA 255, 255, 255, 0.7) with a 20px backdrop blur and a thin gold (`#B8860B`) top-border or 0.5px stroke.
- **Shadows:** Use only one shadow type: a "Golden Glow" for active primary buttons, utilizing a very low-opacity gold tint (`#B8860B` at 15% opacity, 20px blur).

## Shapes
This design system uses **Soft** geometry (`roundedness: 1`). 

The 0.25rem (4px) base radius provides a modern, professional edge that isn't as aggressive as sharp corners nor as "consumer-grade" as fully rounded pills. Larger components like cards use the `rounded-lg` (8px) scale to feel substantial and architectural.

## Components

- **Buttons:** Primary buttons use a solid `#B8860B` background with white text. Secondary buttons use a transparent background with a 1px gold border.
- **Cards:** Use a white glass effect for elevated cards, or a simple `#F8F9FA` background for flat containers. Borders should be extremely thin (0.5px to 1px).
- **Inputs:** Fields should have a white background and a `#F1F3F5` border. On focus, the border transitions to `#B8860B`.
- **Chips/Status:** Use monochromatic fills (very light gray) with high-contrast text. For "success" or "positive" trends, use a subtle gold accent rather than green to maintain the brand aesthetic.
- **Data Tables:** High density with `jetbrainsMono` for numerical values. Rows should be separated by thin `#F1F3F5` lines, avoiding zebra-striping in favor of clean whitespace.