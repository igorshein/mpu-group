/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.html",
    "./src/data/*.js",
    "./src/assets/js/*.js"
  ],
  "darkMode": "class",
  "theme": {
    "extend": {
      "colors": {
        "on-background": "#191c1d",
        "on-tertiary-container": "#fdfbff",
        "on-secondary-fixed": "#1a1c20",
        "secondary-container": "#e2e2e8",
        "on-secondary-container": "#636469",
        "surface-bright": "#f8f9fa",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        "primary-container": "#e31e24",
        "inverse-surface": "#2e3132",
        "on-tertiary-fixed-variant": "#44474f",
        "on-primary-container": "#fffafa",
        "error": "#ba1a1a",
        "tertiary": "#595b64",
        "surface-dim": "#d9dadb",
        "secondary-fixed": "#e2e2e8",
        "secondary": "#5d5e63",
        "surface": "#f8f9fa",
        "on-primary-fixed-variant": "#93000d",
        "tertiary-fixed": "#e0e2ed",
        "on-surface-variant": "#5d3f3c",
        "surface-container-low": "#f3f4f5",
        "outline-variant": "#e7bdb8",
        "background": "#f8f9fa",
        "outline": "#926f6b",
        "on-primary-fixed": "#410002",
        "tertiary-container": "#71747d",
        "surface-tint": "#c00014",
        "primary-fixed-dim": "#ffb4ab",
        "on-surface": "#191c1d",
        "on-error": "#ffffff",
        "surface-variant": "#e1e3e4",
        "on-secondary-fixed-variant": "#45474b",
        "surface-container-highest": "#e1e3e4",
        "on-error-container": "#93000a",
        "inverse-on-surface": "#f0f1f2",
        "secondary-fixed-dim": "#c6c6cb",
        "surface-container": "#edeeef",
        "on-tertiary-fixed": "#181b23",
        "error-container": "#ffdad6",
        "surface-container-lowest": "#ffffff",
        "primary": "#ba0013",
        "primary-bright": "#ff5257",
        "inverse-primary": "#ffb4ab",
        "tertiary-fixed-dim": "#c4c6d1",
        "primary-fixed": "#ffdad6",
        "surface-container-high": "#e7e8e9",
        "on-primary": "#ffffff"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "gutter-mobile": "1rem",
        "space-lg": "1.5rem",
        "space-xs": "0.25rem",
        "gutter": "1.5rem",
        "space-xl": "2.5rem",
        "space-sm": "0.5rem",
        "margin": "3rem",
        "space-md": "1rem",
        "margin-mobile": "1rem"
      },
      "fontFamily": {
        "headline-xl": [
          "Montserrat"
        ],
        "label-caps": [
          "Montserrat"
        ],
        "body-sm": [
          "Manrope"
        ],
        "headline-xl-mobile": [
          "Montserrat"
        ],
        "headline-lg": [
          "Montserrat"
        ],
        "body-md": [
          "Manrope"
        ],
        "display-hero-mobile": [
          "Montserrat"
        ],
        "body-lg": [
          "Manrope"
        ],
        "headline-sm": [
          "Montserrat"
        ],
        "label-tabular": [
          "Manrope"
        ],
        "headline-md": [
          "Montserrat"
        ],
        "display-hero": [
          "Montserrat"
        ]
      },
      "fontSize": {
        "headline-xl": [
          "40px",
          {
            "lineHeight": "48px",
            "letterSpacing": "-0.01em",
            "fontWeight": "700"
          }
        ],
        "label-caps": [
          "12px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.08em",
            "fontWeight": "700"
          }
        ],
        "body-sm": [
          "13px",
          {
            "lineHeight": "18px",
            "fontWeight": "400"
          }
        ],
        "headline-xl-mobile": [
          "28px",
          {
            "lineHeight": "36px",
            "letterSpacing": "0em",
            "fontWeight": "700"
          }
        ],
        "headline-lg": [
          "28px",
          {
            "lineHeight": "36px",
            "letterSpacing": "0.02em",
            "fontWeight": "700"
          }
        ],
        "body-md": [
          "15px",
          {
            "lineHeight": "22px",
            "fontWeight": "400"
          }
        ],
        "display-hero-mobile": [
          "34px",
          {
            "lineHeight": "42px",
            "letterSpacing": "-0.01em",
            "fontWeight": "800"
          }
        ],
        "body-lg": [
          "18px",
          {
            "lineHeight": "28px",
            "fontWeight": "400"
          }
        ],
        "headline-sm": [
          "16px",
          {
            "lineHeight": "24px",
            "letterSpacing": "0.01em",
            "fontWeight": "600"
          }
        ],
        "label-tabular": [
          "13px",
          {
            "lineHeight": "18px",
            "letterSpacing": "0.02em",
            "fontWeight": "600"
          }
        ],
        "headline-md": [
          "20px",
          {
            "lineHeight": "28px",
            "letterSpacing": "0.01em",
            "fontWeight": "700"
          }
        ],
        "display-hero": [
          "56px",
          {
            "lineHeight": "64px",
            "letterSpacing": "-0.02em",
            "fontWeight": "800"
          }
        ]
      }
    }
  }
};
