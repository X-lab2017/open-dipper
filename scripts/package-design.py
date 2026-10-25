#!/usr/bin/env python3
"""Build a deterministic, self-contained visual baseline resource bundle."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
files = {
    'README.md': 'design/README.md',
    'VISUAL_SYSTEM.md': 'docs/VISUAL_SYSTEM.md',
    'tokens.json': 'design/tokens.json',
    'tokens.css': 'src/design/tokens.css',
    'components.css': 'src/design/components.css',
    'palette.ts': 'src/design/palette.ts',
    'icons.ts': 'src/design/icons.ts',
    'brand.ts': 'src/design/brand.ts',
}
for path in (root / 'public/brand').iterdir():
    if path.is_file():
        files['brand/' + path.name] = str(path.relative_to(root))
target = root / 'public/design-system/open-dipper-visual-baseline-v1.zip'
target.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    for name, path in sorted(files.items()):
        entry = ZipInfo('open-dipper-visual-baseline-v1/' + name, (2026, 10, 25, 0, 0, 0))
        entry.compress_type = ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        archive.writestr(entry, (root / path).read_bytes())
with ZipFile(target) as archive:
    assert archive.testzip() is None
print(f'Visual baseline bundle: {len(files)} files, {target.stat().st_size:,} bytes')
