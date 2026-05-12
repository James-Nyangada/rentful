import sharp from "sharp";
import path from "path";
import fs from "fs";

const LOGO_PATH = path.join(__dirname, "..", "assets", "chestone-logo.png");

/**
 * Applies the Chestone Properties watermark to an image buffer.
 * Places the logo + "CHESTONE PROPERTIES" text at the top-right corner.
 * The watermark is permanently composited into the image pixels.
 */
export async function applyWatermark(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Get the original image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const imgWidth = metadata.width || 1200;
    const imgHeight = metadata.height || 800;

    // Scale watermark relative to image size
    const logoSize = Math.round(Math.min(imgWidth, imgHeight) * 0.12);
    const fontSize = Math.round(logoSize * 0.22);
    const padding = Math.round(imgWidth * 0.03);

    // Resize the logo
    let logoBuffer: Buffer;
    if (fs.existsSync(LOGO_PATH)) {
      logoBuffer = await sharp(LOGO_PATH)
        .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    } else {
      // Fallback: create a simple placeholder if logo file is missing
      console.warn("Logo file not found at", LOGO_PATH);
      logoBuffer = await sharp({
        create: {
          width: logoSize,
          height: logoSize,
          channels: 4,
          background: { r: 212, g: 175, b: 55, alpha: 0.8 },
        },
      })
        .png()
        .toBuffer();
    }

    // Create the text overlay SVG
    // Brand color: primary blue #0A2742
    const textSvg = Buffer.from(`
      <svg width="${logoSize + 160}" height="${fontSize * 2.5 + 20}">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Spectral:wght@400;700');
        </style>
        <text 
          x="50%" 
          y="${fontSize * 1.2}" 
          text-anchor="middle" 
          font-family="Spectral, Georgia, serif" 
          font-size="${fontSize * 1.3}px" 
          font-weight="700"
          fill="#0A2742"
          letter-spacing="1"
        >CHESTONE</text>
        <text 
          x="50%" 
          y="${fontSize * 2.5}" 
          text-anchor="middle" 
          font-family="Spectral, Georgia, serif" 
          font-size="${fontSize * 0.8}px" 
          font-weight="400"
          fill="#0A2742"
          letter-spacing="2"
        >PROPERTIES</text>
      </svg>
    `);

    const textBuffer = await sharp(textSvg).png().toBuffer();
    const textMeta = await sharp(textBuffer).metadata();
    const textWidth = textMeta.width || logoSize;
    const textHeight = textMeta.height || fontSize;

    // Calculate the watermark block dimensions
    const blockWidth = Math.max(logoSize, textWidth);
    const blockHeight = logoSize + textHeight + 5;

    // Create composite watermark (logo on top, text below)
    const watermarkBlock = await sharp({
      create: {
        width: blockWidth,
        height: blockHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: logoBuffer,
          top: 0,
          left: Math.round((blockWidth - logoSize) / 2),
        },
        {
          input: textBuffer,
          top: logoSize + 5,
          left: Math.round((blockWidth - textWidth) / 2),
        },
      ])
      .png()
      .toBuffer();

    // Position: top-right corner with padding
    const topOffset = padding;
    const leftOffset = imgWidth - blockWidth - padding;

    // Composite watermark onto original image
    const result = await sharp(imageBuffer)
      .composite([
        {
          input: watermarkBlock,
          top: topOffset,
          left: Math.max(leftOffset, 0),
          blend: "over",
        },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    return result;
  } catch (error) {
    console.error("Watermark application failed:", error);
    // Return original image if watermarking fails
    return imageBuffer;
  }
}
