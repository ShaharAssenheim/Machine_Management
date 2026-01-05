/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Semantic Backgrounds
                bg: {
                    main: 'var(--bg-main)',
                    card: 'var(--bg-card)',
                    sidebar: 'var(--bg-sidebar)',
                    header: 'var(--bg-header)',
                    elevated: 'var(--bg-elevated)',
                    inset: 'var(--bg-inset)',
                },
                // Semantic Text
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                    inverse: 'var(--text-inverse)',
                },
                // Brand/Accent
                accent: {
                    primary: 'var(--accent-primary)',
                    secondary: 'var(--accent-secondary)',
                    tertiary: 'var(--accent-tertiary)',
                    glow: 'var(--accent-glow)',
                },
                // Borders
                border: {
                    subtle: 'var(--border-subtle)',
                    medium: 'var(--border-medium)',
                    highlight: 'var(--border-highlight)',
                    glow: 'var(--border-glow)',
                },
                // Status
                status: {
                    running: 'var(--status-running)',
                    'running-bg': 'var(--status-running-bg)',
                    error: 'var(--status-error)',
                    'error-bg': 'var(--status-error-bg)',
                    warning: 'var(--status-warning)',
                    'warning-bg': 'var(--status-warning-bg)',
                    idle: 'var(--status-idle)',
                    'idle-bg': 'var(--status-idle-bg)',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
            },
            boxShadow: {
                'glow-sm': '0 0 15px var(--accent-glow)',
                'glow-md': '0 0 30px var(--accent-glow)',
                'glow-lg': '0 0 50px var(--accent-glow)',
                'inner-glow': 'inset 0 0 20px var(--accent-glow)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px var(--accent-glow)' },
                    '100%': { boxShadow: '0 0 20px var(--accent-glow), 0 0 30px var(--accent-glow)' },
                },
            },
            backdropBlur: {
                '2xl': '40px',
                '3xl': '64px',
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
}
