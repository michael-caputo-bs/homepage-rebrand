"""
Process hero athlete images for the corporate homepage:
  1. Crop each image tightly so the athlete figure starts at y=0 of the
     output (per-sport top crop, since figures are at different vertical
     positions in each Higgsfield generation).
  2. Crop bottom 10% to strip the Higgsfield watermark.
  3. Apply a side-only alpha feather (rectangular mask, sides feather,
     top/bottom stay opaque) so the figure spans the full vertical
     bounds when rendered.
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

# Per-image top crop — how much empty stadium / sky to remove before the
# figure starts. Tuned per pose so the athlete's head/ball lands right at
# the top edge of the output.
TOP_CROPS = {
    "hero-basketball.png": 0.16,   # ball at ~17% of original
    "hero-football.png":   0.24,   # helmet at ~25-30%
    "hero-soccer.png":     0.13,   # head at ~14-17%
    "hero-boxing.png":     0.24,   # head at ~25-30%
}

# Bottom crop strips the Higgsfield watermark band.
CROP_BOTTOM_FRAC = 0.10


def crop_to_figure(img: Image.Image, top_frac: float, bottom_frac: float) -> Image.Image:
    """Crop top empty space + bottom watermark band so the figure fills bounds."""
    w, h = img.size
    new_top = int(h * top_frac)
    new_bottom = h - int(h * bottom_frac)
    return img.crop((0, new_top, w, new_bottom))


def feather_edges(img: Image.Image) -> Image.Image:
    """Side + bottom alpha feather. Top stays opaque so the athlete's
    head/ball lands sharply at the top edge; sides and bottom soften
    so the photo dissolves into the page bg."""
    img = img.convert("RGBA")
    w, h = img.size

    # Rectangular mask: full top, side inset, bottom inset
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    inset_x = int(w * 0.08)
    inset_bottom = int(h * 0.07)
    draw.rectangle([inset_x, 0, w - inset_x, h - inset_bottom], fill=255)
    blur_radius = int(min(w, h) * 0.06)
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
    top_frac = TOP_CROPS.get(path.name, 0.0)
    img = crop_to_figure(img, top_frac, CROP_BOTTOM_FRAC)
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
