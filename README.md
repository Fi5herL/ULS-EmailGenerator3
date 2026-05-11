# ULS Flex Email Generator (Manifest V3)

This repository has been rebuilt as a Chrome/Edge Manifest V3 extension migration of the Flex Email Generator userscript model.

## Scope

- Runs as a **content script** on:
  - `https://portal.ul.com/Project/Details/*`
- Replaces userscript-only APIs with extension APIs:
  - `GM_getValue / GM_setValue` → `chrome.storage.local`
  - `GM_setClipboard` → `navigator.clipboard` (`clipboardWrite` permission)
  - `GM_registerMenuCommand` → `chrome.contextMenus` + `chrome.commands`
  - userscript command dispatch → background ↔ content message passing
- Supports default YAML templates and custom Excel templates.
- Uses local persisted storage and IndexedDB for remembered File System Access handle.

## Template model

The extension supports 1:1 schema groups in extension runtime:

- `plain`
- `external`
- `scheduled`
- `travelApproval`

Excel workbook sheets:

- `Plain`
- `External`
- `Scheduled`
- `Templates` (legacy compatibility)
- `TravelApproval`

## Library migration

External libraries are vendored in extension package:

- `libs/js-yaml.min.js`
- `libs/xlsx.full.min.js`

Both are loaded directly in content script chain in `manifest.json`.

## Files

- `manifest.json` — MV3 manifest
- `background.js` — context menu + commands + message forwarding
- `content.js` — panel, template engine, YAML/Excel parser, data extraction, generation flow
- `content.css` — panel/modal styles
- `libs/` — bundled dependencies for YAML and Excel
- `icons/` — extension icons

## Install

### Chrome
1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this repo folder

### Edge
1. Open `edge://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this repo folder

## Usage

On UL project detail pages:

- Hover/open panel and choose templates.
- `Default` mode uses built-in YAML templates.
- `Cstm.` mode uses your selected local Excel template workbook.
- Toolbar actions: **Download template / Pick Excel / Reload / Forget / Flex/Fix**.
- Generated subject/body can be copied or opened as mailto.

Context menu and keyboard commands are available from extension background service worker.
