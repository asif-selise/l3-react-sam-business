import { alpha } from "@mui/material"

const GREY = {
  900: "#161C24",
  800: "#212B36",
  700: "#454F5B",
  600: "#637381",
  500: "#919EAB",
  400: "#C4CDD5",
  300: "#DFE3E8",
  200: "#F4F6F8",
  100: "#F9FAFB",
}

export const COMMON = {
  transparent: "#FF000000",
  black: "#000000",
  white: "#FFFFFF",
  grey: GREY,
  divider: alpha(GREY[500], 0.2),
}
