import { createTheme, style } from "@vanilla-extract/css";

export const [themeClass, vars] = createTheme({
  duration: "500ms",
  delay: "0ms",
  initialTransform: "translateY(1rem)",
});

export const base = style({
  opacity: 0,
  transform: vars.initialTransform,
  transition: `opacity ${vars.duration} ${vars.delay}, transform ${vars.duration} ${vars.delay}`,
  "@media": {
    "(prefers-reduced-motion)": {
      opacity: 1,
      transform: "none",
      transition: "none",
    },
  },
});

export const revealed = style({
  opacity: 1,
  transform: "translateY(0)",
  "@media": {
    "(prefers-reduced-motion)": {
      transform: "none",
    },
  },
});
