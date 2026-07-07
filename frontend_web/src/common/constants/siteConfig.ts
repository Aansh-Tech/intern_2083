// common/constants/siteConfig.ts

export const SITE_CONFIG = {
  // Brand / logo — Navbar renders these as "MARCHETTI/DEV"
  brandPrefix: "MARCHETTI",
  brandSuffix: "DEV",

  // Owner identity — NOT available from ProfileController (lives on `users` table,
  // not joined into the API response). Hardcoded here until backend exposes it.
  ownerName: "Your Name Here",
  ownerEmail: "you@example.com",

  // Footer copy
  footerBlurb:
    "Building thoughtful software and writing about the process along the way.",

  // Optional: reused in <title> tags / meta description if you want it centralized
  siteTitle: "Marchetti Dev — Portfolio & Blog",
  siteDescription: "Personal portfolio and blog.",
} as const;