"""Visual + smoke test for Tekniik SPA across breakpoints."""
import os
import sys
from playwright.sync_api import sync_playwright

BASE = os.environ.get('TEKNIIK_URL', 'http://localhost:5174')
OUT = os.environ.get('SHOT_DIR', 'tasks/shots')
os.makedirs(OUT, exist_ok=True)

ROUTES = [
    ('home', '/'),
    ('services', '/services'),
    ('about', '/about'),
    ('contact', '/contact'),
    ('case-looqz', '/case/looqz'),
    ('case-autoscreen', '/case/autoscreen'),
    ('not-found', '/missing-page'),
]

VIEWPORTS = [
    ('mobile-sm', 320, 720),
    ('mobile-md', 414, 896),
    ('tablet', 768, 1024),
    ('desktop', 1280, 900),
    ('wide', 1600, 1000),
]

console_errors = []
console_warnings = []

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for vp_name, w, h in VIEWPORTS:
            ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1)
            page = ctx.new_page()
            page.on('console', lambda msg: (
                console_errors.append(f'[{msg.type}] {msg.text}') if msg.type == 'error'
                else console_warnings.append(msg.text) if msg.type == 'warning'
                else None
            ))
            page.on('pageerror', lambda exc: console_errors.append(f'[pageerror] {exc}'))

            for route_name, path in ROUTES:
                url = f'{BASE}{path}'
                try:
                    page.goto(url, wait_until='networkidle', timeout=15000)
                except Exception as e:
                    console_errors.append(f'[{vp_name} {route_name}] navigation error: {e}')
                    continue
                # let animations settle
                page.wait_for_timeout(900)
                # scroll halfway to trigger reveals/counters
                if vp_name in ('desktop', 'mobile-md'):
                    page.evaluate('window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "instant" })')
                    page.wait_for_timeout(600)
                    page.screenshot(path=f'{OUT}/{vp_name}-{route_name}-mid.png', full_page=False)
                    page.evaluate('window.scrollTo({ top: 0, behavior: "instant" })')
                    page.wait_for_timeout(800)
                page.screenshot(path=f'{OUT}/{vp_name}-{route_name}.png', full_page=False)
                # check for horizontal scroll
                has_hscroll = page.evaluate(
                    'document.documentElement.scrollWidth > document.documentElement.clientWidth + 1'
                )
                if has_hscroll:
                    sw = page.evaluate('document.documentElement.scrollWidth')
                    cw = page.evaluate('document.documentElement.clientWidth')
                    console_errors.append(
                        f'[hscroll] {vp_name} {route_name}: scrollW={sw} > clientW={cw}'
                    )
            ctx.close()
        browser.close()

    print('--- ERRORS ---')
    for e in console_errors:
        print(e)
    print(f'\nTotal errors: {len(console_errors)}')
    print(f'Total warnings: {len(console_warnings)}')
    return 1 if console_errors else 0

if __name__ == '__main__':
    sys.exit(main())
