---
name: AI Market Rates
colors:
  surface: '#121317'
  surface-dim: '#121317'
  surface-bright: '#38393d'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b1f'
  surface-container: '#1e1f23'
  surface-container-high: '#292a2e'
  surface-container-highest: '#343539'
  on-surface: '#e3e2e7'
  on-surface-variant: '#d0c6ab'
  inverse-surface: '#e3e2e7'
  inverse-on-surface: '#2f3034'
  outline: '#999077'
  outline-variant: '#4d4732'
  surface-tint: '#e9c400'
  primary: '#fff6df'
  on-primary: '#3a3000'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#705d00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#fff5ea'
  on-tertiary: '#412d00'
  tertiary-container: '#ffd486'
  on-tertiary-container: '#7c5900'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdea6'
  tertiary-fixed-dim: '#f7bd48'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#121317'
  on-background: '#e3e2e7'
  surface-variant: '#343539'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
---

## Brand & Style
The brand personality is authoritative, precise, and exclusive. This design system caters to high-net-worth individuals and institutional traders who demand the speed of a Bloomberg terminal with the elegance of a luxury lifestyle brand. 

The aesthetic is **Modern Luxury Glassmorphism**. It blends the technical density of professional financial platforms with premium editorial flourishes. The interface should feel like a high-end physical dashboard—expensive materials, precision-machined edges, and deep optical depth. Every interaction must evoke confidence and intelligence, utilizing high-contrast data visualization to ensure that "luxury" never compromises "utility."

## Colors
This design system defaults to a "Midnight Gold" dark mode to maximize the luminance of data points and the premium feel of the gold accents.

- **Primary (Luxury Gold):** Used for critical calls to action, brand iconography, and active state indicators. It should be applied sparingly to maintain its "precious metal" impact.
- **Surface & Backgrounds:** We use an absolute black (#000000) for the base canvas to create infinite depth, with Charcoal Gray (#1A1A1A) used for elevated glass cards.
- **Functional Colors:** Success (Emerald) and Danger (Ruby) are slightly desaturated but high-luminance to ensure they pop against the dark backgrounds without feeling neon or "cheap."
- **Accents:** Linear gradients from #FFD700 to #B8860B are used for borders and progress bars to simulate a metallic sheen.

## Typography
The typography strategy prioritizes legibility for dense financial data while using high-end sans-serifs for a modern, architectural feel.

- **Headlines (Manrope):** Chosen for its balanced, geometric, and modern proportions. It provides the "authoritative" voice of the brand.
- **Body (Inter):** The industry standard for readability in software. Used for all descriptive text and UI controls.
- **Data (JetBrains Mono):** Monospaced numerals are mandatory for price tickers and market rates to prevent "jitter" when numbers update rapidly.
- **Labels:** Uppercase tracking is increased for section headers to create an editorial, organized hierarchy.

## Layout & Spacing
The layout follows a **structured grid** reminiscent of a financial terminal, but with generous "breathing room" to maintain a luxury feel.

- **Grid Model:** A 12-column grid for desktop with 24px gutters. Dashboard widgets should snap to 3, 4, 6, or 12 column widths.
- **Spacing Rhythm:** Based on a 4px baseline. Most components use 8px (xs), 16px (sm), or 24px (md) internal padding.
- **Responsibility:** On mobile, complex data tables should switch to a card-based vertical stack or allow horizontal scrolling with a "sticky" first column for the asset name.
- **Sticky Elements:** Navigation and "Quick Trade" bars remain fixed to ensure the user is never more than one click away from a transaction.

## Elevation & Depth
Depth is achieved through **Tonal Layering and Glassmorphism** rather than traditional drop shadows.

- **Level 0 (Base):** Pure Black (#000000).
- **Level 1 (Cards):** Semi-transparent Charcoal (#1A1A1A at 80% opacity) with a 20px Backdrop Blur.
- **Level 2 (Modals/Popovers):** Slightly lighter gray with a 1px solid stroke in Gold (#FFD700) at 20% opacity.
- **Accents:** Use a "Inner Glow" effect on primary buttons to simulate a back-lit physical interface. 
- **Borders:** Instead of heavy shadows, use thin (1px) gradients to define edges, creating a "hairline" precision look common in luxury watches and high-end automotive UI.

## Shapes
The shape language is **Soft (0.25rem - 0.75rem)**. 

Total sharpness (0px) feels too aggressive/brutalist, while pill-shapes (3) feel too casual/consumer-grade. This design system uses tight, disciplined corners to evoke precision engineering.

- **Standard Elements:** 4px radius for input fields and small buttons.
- **Large Containers:** 12px (0.75rem) for main dashboard cards and modals.
- **Interactive States:** Subtle expansion (scale 1.02x) on hover for cards to indicate interactivity without breaking the grid.

## Components
- **Buttons:** Primary buttons use a gold gradient background with black text. Secondary buttons are "Ghost" style with a gold 1px border.
- **Chips/Badges:** Used for "Bullish" or "Bearish" indicators. These feature a soft glow (box-shadow: 0 0 8px) in the respective green or red color.
- **Financial Charts:** Powered by high-contrast lines. The area under the line should have a subtle gradient fade. Grid lines must be very faint (5% white opacity).
- **Inputs:** Dark backgrounds with a bottom-only gold border that glows when focused. Labels should always be visible (no floating labels that disappear).
- **Cards:** Must utilize the glassmorphism effect (backdrop-blur) with a 1px top-left highlight border to simulate light hitting a glass edge.
- **Data Tickers:** Scrolling horizontal ribbons for live market updates, using JetBrains Mono for perfect alignment.