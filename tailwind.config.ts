import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#f5f5f5',
          hover: '#e5e5e5',
          active: '#d4d4d4',
        },
        tag: {
          red: '#ff6b6b',
          orange: '#ffa94d',
          yellow: '#ffd43b',
          green: '#69db7c',
          blue: '#4dabf7',
          purple: '#da77f2',
          gray: '#868e96',
        }
      },
    },
  },
  plugins: [],
}
export default config
