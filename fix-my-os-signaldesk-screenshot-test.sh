#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f "package.json" ]] || ! grep -q '"name": "inzamam-macos-portfolio"' package.json; then
  echo "Error: run this from the root of my_os_portfolio."
  exit 1
fi

echo "==> Fixing SignalDesk portfolio test"

python3 <<'PY'
from pathlib import Path

path = Path("src/App.test.jsx")
text = path.read_text()

old = 'expect(screen.getByRole("heading", { name: "SignalDesk AI" })).toBeInTheDocument();'
new = 'expect(screen.getByRole("heading", { name: "SignalDesk" })).toBeInTheDocument();'

if old not in text:
    if new in text:
        print("Test expectation already updated.")
    else:
        raise SystemExit(
            "Could not find the SignalDesk heading assertion in src/App.test.jsx"
        )
else:
    path.write_text(text.replace(old, new))
    print("Updated SignalDesk heading assertion.")
PY

# Remove the temporary patch script that was accidentally committed earlier.
rm -f upgrade-my-os-signaldesk-showcase.sh

echo "==> Running tests"
CI=true npm test -- --watchAll=false

echo "==> Running production build"
npm run build

echo
echo "============================================================"
echo "Portfolio test fixed and temporary upgrade script removed."
echo
echo "The final SignalDesk screenshot should already be located at:"
echo "  public/projects/signaldesk/dashboard-light.png"
echo
echo "Review:"
echo "  npm start"
echo
echo "Then commit everything together:"
echo "  git add -A"
echo '  git commit -m "Update SignalDesk portfolio screenshot and tests"'
echo "  git push"
echo "============================================================"
