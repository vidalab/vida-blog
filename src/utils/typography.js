import Typography from "typography"

const typography = new Typography({
  overrideStyles: ({ rhythm }, options, styles) => ({
    body: {
      fontFamily: '"system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
    },
    a: {
      textDecoration: "inherit",
      color: "#4299e1"
    }
  })
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
