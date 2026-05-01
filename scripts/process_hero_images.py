"""
Process hero athlete images for the corporate homepage:
  1. Remove the "HIGGSFIELD AI" watermark by cropping the bottom band
     (the watermark sits in the bottom-right corner; the athletes do not
     extend that far down in any of the four photos).
  2. Bake a feathered alpha edge into the image so it blends seamlessly
     with the dark hero background (#07111F).
Outputs RGBA PNGs over the originals (in-place replacement).
"""

from PIL import Image, ImageFilter, ImageDraw, ImageChops
from pathlib import Path

ASSETS = Path(r"C:/Users/micha/OneDrive/Documents/Claude/Projects/homepage-rebrand/assets")
IMAGES = [
    "hero-basketball.png",
    "hero-football.png",
    "hero-soccer.png",
    "hero-boxing.png",
]

# How much of the bottom of each image to crop. 10% safely removes the
# Higgsfield watermark without clipping any athlete bodies in this set.
CROP_BOTTOM_FRAC = 0.10


def crop_watermark(img: Image.Image) -> Image.Image:
    """Crop the bottom band that contains the Higgsfield watermark."""
    w, h = img.size
    new_h = h - int(h * CROP_BOTTOM_FRAC)
    return img.crop((0, 0, w, new_h))


def feather_edges(img: Image.Image) -> Image.Image:
    """Add a radial alpha falloff so the image dissolves into the page bg."""
    img = img.convert("RGBA")
    w, h = img.size

    # Build an elliptical mask: opaque in the middle, fading to transparent at edges.
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)

    # Inner solid-opaque ellipse (~70-80% of canvas), heavy blur to feather out.
    inset_x = int(w * 0.10)
    inset_y = int(h * 0.05)
    draw.ellipse([inset_x, inset_y, w - inset_x, h - inset_y], fill=255)
    blur_radius = int(min(w, h) * 0.09)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=blur_radius))

    # Multiply existing alpha with the new feather mask
    r, g, b, a = img.split()
    new_a = ImageChops.multiply(a, mask)
    img.putalpha(new_a)
    return img


def process(path: Path) -> None:
    print(f"  Processing {path.name}...", end=" ")
    img = Image.open(path).convert("RGBA")
    before = img.size
    img = crop_watermark(img)
    img = feather_edges(img)
    img.save(path, "PNG", optimize=True)
    print(f"done {before} -> {img.size} ({path.stat().st_size // 1024} KB)")


def main():
    print("Hero image processor")
    print("=" * 50)
    for name in IMAGES:
        process(ASSETS / name)
    print("=" * 50)
    print("All images processed.")


if __name__ == "__main__":
    main()
