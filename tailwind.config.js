module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {

        // ╔══════════════════════════════════════════════╗
        // ║         CORE BRAND ORANGE TOKENS             ║
        // ╚══════════════════════════════════════════════╝
        orange400: '#ec9639',   // Primary brand orange
        orange300: '#edac66',   // Soft orange
        orange200: '#edb67a',   // Muted orange
        orange100: '#f1c798',   // Pale orange

        // ╔══════════════════════════════════════════════╗
        // ║        EXTENDED ORANGE SCALE                 ║
        // ╚══════════════════════════════════════════════╝
        orange: {
          50:  '#FFF8EE',   // Lightest tint — page/card backgrounds
          100: '#FFF3E0',   // Icon fills, tag backgrounds
          150: '#FFE9C7',   // Hover backgrounds
          200: '#FFDDA8',   // Soft badges, chips
          250: '#FFD08A',   // Light accents
          300: '#FFC46C',   // Borders, dividers
          350: '#FFB44E',   // Placeholder text on dark
          400: '#ec9639',   // ★ Primary brand (matches orange400)
          450: '#E08830',   // Hover state of primary
          500: '#D47A20',   // Active / pressed state
          550: '#C46C14',   // Strong accent
          600: '#B45E08',   // Deep accent, dark icons
          650: '#9E5206',   // Rich warm orange
          700: '#884604',   // Darker orange, headings on light
          750: '#723B02',   // Near-brown orange
          800: '#5C3001',   // Dark orange background
          850: '#472500',   // Very dark, text on light orange
          900: '#321900',   // Darkest tint, shadow/overlay base
          950: '#1E1000',   // Near-black warm tint
        },

        // ╔══════════════════════════════════════════════╗
        // ║         AMBER / GOLDEN COMPANIONS            ║
        // ╚══════════════════════════════════════════════╝
        amber: {
          50:  '#FFFBF0',   // Warm white
          100: '#FFF4D1',   // Pale gold background
          200: '#FFE99E',   // Light gold badge
          300: '#FFD966',   // Gold chip / tag
          400: '#FFC933',   // Bright gold accent
          500: '#F5B800',   // Pure gold
          600: '#D9A200',   // Deep gold, icon color
          700: '#B88600',   // Rich gold
          800: '#8F6800',   // Dark gold
          900: '#664B00',   // Very dark gold
        },

        // ╔══════════════════════════════════════════════╗
        // ║         WARM BROWN / BURNT ORANGE            ║
        // ╚══════════════════════════════════════════════╝
        burnt: {
          100: '#FDE8D8',   // Blush orange
          200: '#FAC9A8',   // Peach
          300: '#F5A878',   // Warm peach
          400: '#EE8448',   // Burnt orange light
          500: '#E56018',   // Burnt orange
          600: '#C44D10',   // Deep burnt
          700: '#9E3B0A',   // Dark terracotta
          800: '#772B06',   // Rich terracotta
          900: '#501C03',   // Near-black terracotta
        },

        // ╔══════════════════════════════════════════════╗
        // ║          WARM NEUTRALS (Orange-tinted)       ║
        // ╚══════════════════════════════════════════════╝
        warmGray: {
          50:  '#FAF7F4',   // Page background (warm off-white)
          100: '#F3EDE5',   // Card background
          200: '#E8DDD0',   // Light border
          300: '#D6C8B6',   // Divider
          400: '#B8A690',   // Muted text on light
          500: '#9A8470',   // Subtext
          600: '#7A6555',   // Body text
          700: '#5C4A3A',   // Dark body
          800: '#3E3028',   // Near-dark
          900: '#241C16',   // Very dark warm
        },

        // ╔══════════════════════════════════════════════╗
        // ║         DARK SIDEBAR / HERO TONES            ║
        // ╚══════════════════════════════════════════════╝
        black700: '#171717',   // Sidebar bg, overlay
        black600: '#2a1a00',   // Hero mid gradient
        black500: '#3d2200',   // Hero end gradient
        black400: '#4f2d00',   // Dark warm background
        black300: '#6b3d00',   // Warm-tinted dark

        // ╔══════════════════════════════════════════════╗
        // ║         SEMANTIC / UI ALIASES               ║
        // ╚══════════════════════════════════════════════╝
        brand: {
          light:   '#FFF8EE',   // bg-brand-light  — card/input fill
          soft:    '#f1c798',   // bg-brand-soft   — border / divider
          base:    '#ec9639',   // bg-brand-base   — primary CTA
          hover:   '#d4782a',   // bg-brand-hover  — hover state
          dark:    '#b45e08',   // bg-brand-dark   — pressed / deep
          muted:   '#edac66',   // bg-brand-muted  — secondary labels
        },

      },

      fontFamily: {
        epundaslab: ['"Epunda Slab", serif'],
        poppins:    ['"Poppins", sans-serif'],
        roboto:     ['"Roboto", sans-serif'],
        inria:      ['"Inria Sans", sans-serif'],
      },

      backgroundImage: {
        'brand-gradient':   'linear-gradient(135deg, #ec9639, #d4782a)',
        'brand-gradient-v': 'linear-gradient(to bottom, #ec9639, #d4782a)',
        'hero-gradient':    'linear-gradient(135deg, #171717 0%, #2a1a00 65%, #3d2200 100%)',
        'warm-gradient':    'linear-gradient(135deg, #FFF8EE 0%, #FFE9C7 100%)',
        'gold-gradient':    'linear-gradient(135deg, #FFC933, #F5B800)',
        'sidebar-gradient': 'linear-gradient(to bottom, #171717, #2a1200)',
      },

      boxShadow: {
        'brand':    '0 4px 14px rgba(236,150,57,0.35)',
        'brand-lg': '0 8px 24px rgba(236,150,57,0.25)',
        'brand-sm': '0 0 0 2px #edac66, 0 0 0 4px #fff',
        'warm':     '0 4px 14px rgba(212,120,42,0.20)',
      },

    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}