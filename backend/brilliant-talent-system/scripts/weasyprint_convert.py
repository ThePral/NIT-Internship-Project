#!/usr/bin/env python3
# scripts/weasyprint_convert.py
import sys
from pathlib import Path
from weasyprint import HTML, CSS

def main():
    if len(sys.argv) < 3:
        print("Usage: weasyprint_convert.py input.html output.pdf [css1 css2 ...]", file=sys.stderr)
        sys.exit(2)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    css_paths = [Path(p) for p in sys.argv[3:]] if len(sys.argv) > 3 else []

    if not input_path.exists():
        print(f"Input HTML not found: {input_path}", file=sys.stderr)
        sys.exit(3)

    html = HTML(filename=str(input_path))
    css_objs = [CSS(filename=str(p)) for p in css_paths if p.exists()]

    html.write_pdf(target=str(output_path), stylesheets=css_objs)
    print(str(output_path))
    sys.exit(0)

if __name__ == '__main__':
    main()
