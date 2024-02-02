import { Fira_Code as FontMono, Inter as FontSans  , Silkscreen as FontSilkscreen} from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const Silkscreen = FontSilkscreen({
  subsets: ["latin"],
  weight:"400",
})