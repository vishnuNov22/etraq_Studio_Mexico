# Söhne Extraleicht Regular — client-mandated typeface

Klim Type Foundry · Kris Sowersby · version shown by client: 1.112

Söhne is a **commercial font**. The licensed files were not part of the supplied materials, so they are
not bundled and the site currently falls back to DM Sans Light (a temporary, visually similar stand-in).

## To finish the implementation (2 minutes)
1. Purchase / locate the studio's web licence from https://klim.co.nz (Söhne Extraleicht, woff2).
2. Save the file here as `Soehne-Extraleicht.woff2`.
3. In `src/app/globals.css`, in the `@font-face` for "Söhne Extraleicht", uncomment the `url("/fonts/Soehne-Extraleicht.woff2")` line.
4. Deploy. Headings, navigation, labels and body text pick it up automatically (the font stack already lists it first).

Only the Extraleicht (200) cut is requested; the CSS maps it across weights 100–400 and disables
faux-bold/italic (`font-synthesis: none`) so the face is never distorted. Emphasis in running text uses a
slightly heavier fallback weight only until a second Söhne weight is licensed.
