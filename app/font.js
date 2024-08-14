import { IBM_Plex_Mono as plexMono } from "next/font/google";

const ibmPlexMono = plexMono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default ibmPlexMono;
