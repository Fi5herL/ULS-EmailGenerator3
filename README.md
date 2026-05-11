# ULS Email Generator

A Chrome / Edge **Manifest V3** browser extension that generates project inactive letters and other email templates for UL portal projects.

---

## Features

### Standalone Excel-based Generator (`generator.html`)
- Paste tab-separated data copied from Excel (including a header row).
- Auto-detects column headers and maps them to known fields; manual override via dropdowns.
- Click any row to select it as the active data source.
- Generate emails from **8 templates** with a single click.
- Click-to-copy on subject and body textareas.
- **Open as mailto:** button pre-fills your email client.

### Automatic Content-Script Panel (portal.ul.com)
- Activates automatically on `https://portal.ul.com/Project/Details/*`.
- Extracts project data directly from the page (no copy-pasting needed).
- Floating panel at bottom-right: collapsible, closeable, state saved in `localStorage`.
- Generates Inactive Letters, Close Letter, NOA Follow-up, and Travel Approval emails.
- One-click links to EPIC reports (ECD, TAT, NOA, PI Letters).

---

## Available Templates

| Template | Language | Notes |
|---|---|---|
| Notice Inactive Letter | Chinese (Traditional) | First notice of project hold |
| Inactive Letter 1 | Chinese (Traditional) | 1-month follow-up |
| Inactive Letter 2 | Chinese (Traditional) | 2-month follow-up |
| Inactive Letter 3 | Chinese (Traditional) | 3-month follow-up |
| Inactive Letter Final | Chinese (Traditional) | Final notice before closure |
| Close Letter | English | Project closure confirmation |
| NOA Follow-up | English | Notice of Authorization email |
| Travel Approval | English | Business trip approval request |

---

## Data Fields

| Column | Maps to | Notes |
|---|---|---|
| Project Number | `#PjNum#` / `{pjNum}` | Oracle Project Number |
| Order Number | `#OdrNum#` | Service order number |
| Project Name | `#PjName#` | |
| Project Scope | `#PjScope#` / `{pjScope}` | Certification description |
| Project Hold Reason | `#Project Hold Reason#` | Reason project is on hold |
| Date Booked | `xxx年xx月` | Format M/D/YYYY → converted to ROC calendar |
| Client Name | `{clientName}` | |
| Client Email | `{clientEmail}` | Used as mailto: recipient |
| Project Handler Email | `{projectHandlerEmail}` | |
| Deadline Date | `#DeadlineDate#` | Optional; auto-calculated as today + 14 days |

**ROC date conversion:** Gregorian year − 1911 = Republic of China year.  
Example: `3/15/2023` → `中華民國112年3月` (for inactive letters) or `中華民國112年3月15日` (for deadline).

---

## How to Load the Extension

### Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the folder containing `manifest.json` (this directory).
5. The extension icon will appear in the toolbar.

### Edge
1. Open Edge and navigate to `edge://extensions/`.
2. Enable **Developer mode** (toggle in the left sidebar).
3. Click **Load unpacked**.
4. Select the folder containing `manifest.json`.

---

## How to Use the Excel Generator

1. Click the **ULS Email Generator** extension icon → **Open Email Generator**.
2. In the **Paste Data** section:
   - Copy rows from Excel (with headers) and paste into the textarea.
   - Click **Parse Data**.
3. The **column mapping table** appears — verify or adjust which column maps to which field.
   - Click **Apply Mapping & Refresh Table** if you change mappings.
4. In the **Select Row** table, click the row you want to generate an email for.
5. In the **Choose Template** section:
   - Click any template button to generate immediately (for non-Travel templates).
   - For **Travel Approval**, fill in the form fields that appear, then click **Generate Travel Approval Email**.
6. The generated **Subject** and **Body** appear in Step 4:
   - Click either textarea (or use the Copy buttons) to copy to clipboard.
   - Click **Open as mailto:** to open your email client with the content pre-filled.

---

## File Structure

```
ULS-EmailGenerator3/
├── manifest.json       — Extension manifest (Manifest V3)
├── popup.html          — Extension toolbar popup
├── popup.js            — Popup logic
├── popup.css           — Popup styles
├── generator.html      — Standalone Excel-based generator page
├── generator.js        — Generator logic (templates, parsing, substitution)
├── generator.css       — Generator styles
├── content.js          — Content script for portal.ul.com (floating panel)
├── content.css         — Reference CSS for content script styles
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## Permissions

| Permission | Reason |
|---|---|
| `clipboardWrite` | Used to copy generated emails to clipboard |
| `storage` | Saves panel state (collapsed/expanded) |
| `https://portal.ul.com/*` | Required for the content script to run on the UL portal |
