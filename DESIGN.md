---
name: Serene Boutique Dental
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#46464d'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#77767e'
  outline-variant: '#c7c5ce'
  surface-tint: '#595c7c'
  primary: '#040723'
  on-primary: '#ffffff'
  primary-container: '#1b1f3b'
  on-primary-container: '#8386a8'
  inverse-primary: '#c1c4e9'
  secondary: '#745a27'
  on-secondary: '#ffffff'
  secondary-container: '#fedb9b'
  on-secondary-container: '#795f2b'
  tertiary: '#0d0a05'
  on-tertiary: '#ffffff'
  tertiary-container: '#242119'
  on-tertiary-container: '#8e887d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#c1c4e9'
  on-primary-fixed: '#151935'
  on-primary-fixed-variant: '#414563'
  secondary-fixed: '#ffdea4'
  secondary-fixed-dim: '#e4c285'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5a4312'
  tertiary-fixed: '#e9e2d5'
  tertiary-fixed-dim: '#cdc6b9'
  on-tertiary-fixed: '#1e1b14'
  on-tertiary-fixed-variant: '#4b463d'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 56px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
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
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 20px
---

## Brand & Style

This design system is crafted to reflect the "hygge" philosophy within a high-end medical context. The brand personality is **sophisticated, tranquil, and authoritative**, moving away from the sterile, cold aesthetics of traditional dentistry. 

The visual style blends **Editorial Minimalism** with **Tactile warmth**. It prioritizes generous whitespace, intentional contrast, and a harmonious balance between technical precision (the clinic) and organic comfort (the "wood and light" atmosphere). The emotional response should be one of immediate calm and trust, evoking the feeling of entering a luxury spa rather than a clinical environment.

## Colors

The palette is anchored by a deep, authoritative navy and accented with a warm, metallic gold. The background and surfaces use a "bone and cream" approach to provide a soft, warm glow that mimics natural wood and stone textures.

- **Primary (Navy):** Used for headers, hero sections, and primary call-to-actions to establish authority.
- **Secondary (Gold):** Used sparingly for interactive accents, icons, and premium flourishes.
- **Tertiary (Beige):** The main background color, providing a warm "hygge" base.
- **Surface (Off-white):** Used for card elements to create a subtle lift from the beige background.
- **Text:** Charcoal Gray provides high legibility on light surfaces, while Wood Cream is reserved for high-contrast typography on Navy backgrounds.

## Typography

The typography system relies on the tension between a high-contrast, luxury serif and a modern, functional sans-serif.

- **Bodoni Moda** is used for headlines to convey an editorial, high-fashion aesthetic. It should be used with tight tracking for larger displays to emphasize its elegance.
- **Manrope** provides a clean, professional, and highly readable counterpoint for all body copy and labels. Its geometric yet soft nature maintains the "friendly professional" tone.
- **Hierarchy:** Maintain large margins between headline levels to allow the elegant serif letterforms to "breathe."

## Layout & Spacing

The layout follows a **Fluid Grid** model with a maximum container width to ensure the content feels organized and intentional. 

- **Desktop:** A 12-column grid with generous 120px vertical gaps between major sections to emphasize a premium, unhurried experience.
- **Tablet:** 8-column grid with 80px section gaps.
- **Mobile:** 4-column grid with 20px side margins. 
- **Rhythm:** Use an 8px baseline grid. Padding within cards and containers should be generous (typically 32px or 40px) to reinforce the sense of "space" and "comfort."

## Elevation & Depth

To maintain the "warm" and "hygge" feel, this design system avoids harsh, technical shadows. Instead, it utilizes **Tonal Layers** and **Ambient Glows**.

- **Surfaces:** Use #FDFCF8 (Surface) on top of #F5EDE0 (Tertiary) to create a soft, natural depth.
- **Shadows:** When necessary for interactive elements, use extremely soft, low-opacity shadows tinted with the primary navy color (e.g., `rgba(27, 31, 59, 0.04)`) to simulate natural, diffused lighting.
- **Glassmorphism:** Reserved for navigation overlays, using a light backdrop blur (12px) and a semi-transparent version of the Off-white color to mimic frosted glass.

## Shapes

The shape language is **Soft and Structural**. Elements use subtle rounding to feel approachable without losing the architectural precision of the clinic's interior design.

- **Standard Elements:** Buttons and small input fields use a `0.25rem` (4px) radius.
- **Container Elements:** Large cards and image containers use `rounded-lg` (8px) to create a gentle frame for content.
- **Icons:** Should feature a medium stroke weight (1.5px - 2px) with slightly rounded terminals to match the typography.

## Components

- **Buttons:** 
  - *Primary:* Navy background with Wood Cream text. Rectangular with minimal rounding.
  - *Secondary:* Transparent with a Gold border (1px) and Gold text. 
- **Cards:** Off-white backgrounds with subtle 1px borders in a darker tint of the Tertiary color (#E5DED0) instead of shadows.
- **Inputs:** Underlined or lightly boxed with a subtle beige fill. Focus states should transition to a Gold border.
- **Chips/Labels:** Small, all-caps Manrope text with high letter spacing, set against a light Navy or Gold wash.
- **Lists:** Use custom Gold bullet points or sophisticated Navy icons to maintain the premium dental theme.
- **Navigation:** Top-tier navigation should be minimal, utilizing the Bodoni Moda typeface for a logo-centric, editorial feel.