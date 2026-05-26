# Releasing

Foundry installs modules from a **release** `module.json` that includes a `download` URL to `module.zip`. The source file `src/module.json` does not include `download`; the build adds it to `dist/module.json`.

## Automatic (recommended)

1. Bump `version` in `package.json` and `CHANGELOG.md`.
2. Commit and push to `main`.
3. On GitHub: **Releases → Draft a new release**
   - Tag: `v1.0.3` (must start with `v`, match package version)
   - Publish the release (not draft)
4. The [publish workflow](.github/workflows/publish.yml) runs on `release: published`, builds the module, and uploads:
   - `module.json` (with `manifest` + `download`)
   - `module.zip` (built files only, a few KB)

Do **not** manually attach `src/module.json` or a zip of the whole repository.

## Manual release fix

If a release already has the wrong assets (e.g. `dist.zip` or a manifest without `download`):

```bash
# Tag must match the GitHub release tag, e.g. v1.0.0
set GH_PROJECT=StartariAlessio/anarchist-overlay-v13
set GH_TAG=v1.0.0
set MODULE_VERSION=1.0.0
npm run build:release
```

On Linux/macOS use `export` instead of `set`.

Then on the GitHub release page:

1. Delete wrong assets (`dist.zip`, old `module.json`).
2. Upload `dist/module.json` and `dist/module.zip` (names must be exact).

## Zip layout

`module.zip` must contain at its **root**:

```
module.json
style.css
scripts/module.js
templates/...
```

Not the `dist/` folder itself, and not the full git repo (no `node_modules`).

## Install URL

Users should use:

```
https://github.com/StartariAlessio/anarchist-overlay-v13/releases/latest/download/module.json
```
