'use strict';

(() => {
  if (window.__FLEX_EMAIL_GENERATOR_V3__) return;
  window.__FLEX_EMAIL_GENERATOR_V3__ = true;

  const STORAGE = {
    MODE: 'feg.mode',
    PANEL_VISIBLE: 'feg.panelVisible',
    PANEL_FIXED: 'feg.panelFixed',
    CUSTOM_CONFIG: 'feg.customConfig',
    CUSTOM_FILE_META: 'feg.customFileMeta'
  };

  const DB_NAME = 'feg-db';
  const DB_STORE = 'handles';
  const HANDLE_KEY = 'custom-template-handle';

  const DEFAULT_CONFIG_YAML = `
plain:
  - id: notice
    name: Notice
    titleTemplate: "Project Inactive Letter–Project #PjNum#/關於UL項目#PjNum#暫停通知書"
    contentTemplate: |
      Dear Customer,

      This letter serves as a notice that project #PjNum# (order #OdrNum#) has entered inactive status.
      Scope: #PjScope#
      Hold Reason: #ProjectHoldReason#

      Regards,
      {{projectHandler}}
  - id: close
    name: Close Letter
    titleTemplate: "Close Letter - Project #PjNum#"
    contentTemplate: |
      Dear {{clientName}},

      Project #PjNum# has been closed in UL system.
      Scope: {{pjScope}}

      Regards,
      {{projectHandler}}
external:
  - id: epic-ecd
    name: EPIC ECD
    urlTemplate: "https://epic.ul.com/report/ecd?project=#PjNum#"
    openInNewTab: true
    openMailto: false
  - id: epic-tat
    name: EPIC TAT
    urlTemplate: "https://epic.ul.com/report/tat?project=#PjNum#"
    openInNewTab: true
    openMailto: false
scheduled:
  - id: final-notice
    name: Final Notice (with date)
    dateLabel: "Deadline"
    dateVar: "DeadlineDate"
    titleTemplate: "Final Notice - #PjNum#"
    contentTemplate: |
      Dear Customer,

      This is final notice for project #PjNum#.
      Please respond before #DeadlineDate#.

      Regards,
      {{projectHandler}}
travelApproval:
  enabled: true
  buttonName: Travel Approval
  subjectTemplate: "Travel Approval for pj.#PjNum# - {{dates}} - {{from}} to {{to}}"
  bodyTemplate: |
    Dear Manager,

    I would like to apply for a business trip.

    Reason: {{reason}}
    Date(s): {{dates}}
    From: {{from}}
    To: {{to}}
    Billing Type: {{billingType}}

    Project: #PjNum#

    Regards,
    {{projectHandler}}
  locations:
    - Taipei
    - Taichung
    - Tainan
  billingTypes:
    - Billable
    - Non-billable
`;

  const state = {
    mode: 'default',
    panelVisible: true,
    panelFixed: false,
    config: null,
    root: null,
    panel: null,
    subjectEl: null,
    bodyEl: null,
    statusEl: null,
    modeEl: null,
    templateContainer: null
  };

  const TemplateEngine = {
    render(text, vars) {
      if (!text) return '';
      const data = vars || {};
      return String(text)
        .replace(/#([A-Za-z0-9_]+)#/g, (_, k) => data[k] ?? '')
        .replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (_, k) => data[k] ?? '');
    }
  };

  function storageGet(keys) {
    return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
  }

  function storageSet(obj) {
    return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(DB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbSet(key, value) {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }

  async function idbGet(key) {
    const db = await openDB();
    const val = await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return val;
  }

  async function idbDelete(key) {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }

  function normalizeConfig(cfg) {
    const normalized = {
      plain: Array.isArray(cfg?.plain) ? cfg.plain : [],
      external: Array.isArray(cfg?.external) ? cfg.external : [],
      scheduled: Array.isArray(cfg?.scheduled) ? cfg.scheduled : [],
      travelApproval: cfg?.travelApproval && typeof cfg.travelApproval === 'object' ? cfg.travelApproval : { enabled: false }
    };
    validateConfig(normalized);
    return normalized;
  }

  function validateConfig(config) {
    const must = (arr, fields, group) => {
      for (const t of arr) {
        for (const f of fields) {
          if (!t?.[f]) throw new Error(`Template schema invalid: ${group}.${f} required`);
        }
      }
    };
    must(config.plain, ['id', 'name', 'titleTemplate', 'contentTemplate'], 'plain');
    must(config.external, ['id', 'name', 'urlTemplate'], 'external');
    must(config.scheduled, ['id', 'name', 'titleTemplate', 'contentTemplate', 'dateVar'], 'scheduled');
  }

  function yamlToConfig(yamlText) {
    const parsed = jsyaml.load(yamlText);
    return normalizeConfig(parsed || {});
  }

  function sheetRows(workbook, name) {
    const ws = workbook.Sheets[name];
    if (!ws) return [];
    return XLSX.utils.sheet_to_json(ws, { defval: '' });
  }

  function excelToConfig(arrayBuffer) {
    const wb = XLSX.read(arrayBuffer, { type: 'array' });
    const legacyRows = sheetRows(wb, 'Templates');

    let plain = sheetRows(wb, 'Plain').map((r) => ({
      id: String(r.id || r.ID || r.Name || '').trim(),
      name: String(r.name || r.Name || r.id || '').trim(),
      titleTemplate: String(r.titleTemplate || r.Subject || r.subject || '').trim(),
      contentTemplate: String(r.contentTemplate || r.Body || r.body || '')
    }));

    if (!plain.length && legacyRows.length) {
      plain = legacyRows.map((r) => ({
        id: String(r.id || r.ID || r.Name || '').trim(),
        name: String(r.name || r.Name || '').trim(),
        titleTemplate: String(r.titleTemplate || r.subject || '').trim(),
        contentTemplate: String(r.contentTemplate || r.body || '')
      })).filter((x) => x.id && x.name && x.titleTemplate);
    }

    const external = sheetRows(wb, 'External').map((r) => ({
      id: String(r.id || r.ID || r.Name || '').trim(),
      name: String(r.name || r.Name || '').trim(),
      urlTemplate: String(r.urlTemplate || r.url || '').trim(),
      params: String(r.params || '').trim(),
      openInNewTab: String(r.openInNewTab ?? 'true').toLowerCase() !== 'false',
      openMailto: String(r.openMailto ?? 'false').toLowerCase() === 'true',
      addFRDate: String(r.addFRDate ?? 'false').toLowerCase() === 'true'
    })).filter((x) => x.id && x.name && x.urlTemplate);

    const scheduled = sheetRows(wb, 'Scheduled').map((r) => ({
      id: String(r.id || r.ID || r.Name || '').trim(),
      name: String(r.name || r.Name || '').trim(),
      dateLabel: String(r.dateLabel || 'Date').trim(),
      dateVar: String(r.dateVar || 'SelectedDate').trim(),
      titleTemplate: String(r.titleTemplate || r.subject || '').trim(),
      contentTemplate: String(r.contentTemplate || r.body || '')
    })).filter((x) => x.id && x.name && x.titleTemplate && x.dateVar);

    const travelRow = sheetRows(wb, 'TravelApproval')[0] || {};
    const travelApproval = {
      enabled: String(travelRow.enabled ?? 'true').toLowerCase() !== 'false',
      buttonName: String(travelRow.buttonName || 'Travel Approval'),
      subjectTemplate: String(travelRow.subjectTemplate || 'Travel Approval for pj.#PjNum# - {{dates}}'),
      bodyTemplate: String(travelRow.bodyTemplate || 'Dear Manager,\n\n{{reason}}'),
      locations: String(travelRow.locations || '').split(/[;,\n]/).map((s) => s.trim()).filter(Boolean),
      billingTypes: String(travelRow.billingTypes || '').split(/[;,\n]/).map((s) => s.trim()).filter(Boolean)
    };

    return normalizeConfig({ plain, external, scheduled, travelApproval });
  }

  function gatherPageData() {
    const text = (el) => (el?.textContent || '').trim();
    const byLabel = (label) => {
      const all = [...document.querySelectorAll('td,th,div,span,label')];
      const hit = all.find((n) => text(n).replace(/[:：]$/, '') === label);
      if (!hit) return '';
      const row = hit.closest('tr');
      if (row) {
        const cells = [...row.querySelectorAll('td')].map(text).filter(Boolean);
        if (cells.length >= 2) return cells[cells.length - 1];
      }
      return text(hit.nextElementSibling) || text(hit.parentElement?.querySelector('td:last-child'));
    };

    const body = document.body.innerText || '';
    const pick = (regex) => body.match(regex)?.[1]?.trim() || '';

    const pjNum = byLabel('Project Number') || pick(/Project\s*Number\s*[:：]?\s*([A-Za-z0-9-]+)/i);
    const odrNum = byLabel('Order Number') || pick(/Order\s*Number\s*[:：]?\s*([A-Za-z0-9-]+)/i);
    const pjScope = byLabel('Project Scope') || '';
    const pjName = byLabel('Project Name') || '';
    const holdReason = byLabel('Project Hold Reason') || '';
    const clientName = byLabel('Client Name') || '';
    const clientEmail = byLabel('Client Email') || pick(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const projectHandler = byLabel('Project Handler') || byLabel('Project Handler Name') || '';
    const projectHandlerEmail = byLabel('Project Handler Email') || '';
    const customerAddress = byLabel('Customer Address') || '';
    const projectAnchorHref = document.querySelector('a[href*="Project/Details"]')?.href || location.href;

    return {
      PjNum: pjNum,
      OdrNum: odrNum,
      PjScope: pjScope,
      PjName: pjName,
      ProjectHoldReason: holdReason,
      clientName,
      clientEmail,
      projectHandler,
      projectHandlerEmail,
      customerAddress,
      projectAnchorHref,
      pjNum,
      odrNum,
      pjScope,
      pjName
    };
  }

  function setOutput(subject, body) {
    state.subjectEl.value = subject || '';
    state.bodyEl.value = body || '';
  }

  async function copyOutput() {
    const text = `Subject: ${state.subjectEl.value}\n\n${state.bodyEl.value}`.trim();
    await navigator.clipboard.writeText(text);
    setStatus('Copied to clipboard');
  }

  function openMailto(subject, body, to = '') {
    const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_self');
  }

  function setStatus(msg, error = false) {
    state.statusEl.textContent = msg;
    state.statusEl.style.color = error ? '#b42318' : '#344054';
  }

  async function loadCustomByHandle() {
    const handle = await idbGet(HANDLE_KEY);
    if (!handle) throw new Error('No remembered Excel handle');
    const file = await handle.getFile();
    const cfg = excelToConfig(await file.arrayBuffer());
    state.config = cfg;
    await storageSet({ [STORAGE.CUSTOM_CONFIG]: cfg, [STORAGE.CUSTOM_FILE_META]: { name: file.name, mtime: file.lastModified } });
    renderTemplateButtons();
    setStatus(`Custom templates reloaded: ${file.name}`);
  }

  async function pickCustomExcel() {
    if (!window.showOpenFilePicker) {
      throw new Error('showOpenFilePicker is not available in this browser context');
    }
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      types: [{ description: 'Excel files', accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } }]
    });
    const file = await handle.getFile();
    const cfg = excelToConfig(await file.arrayBuffer());
    await idbSet(HANDLE_KEY, handle);
    await storageSet({
      [STORAGE.CUSTOM_CONFIG]: cfg,
      [STORAGE.CUSTOM_FILE_META]: { name: file.name, mtime: file.lastModified },
      [STORAGE.MODE]: 'custom'
    });
    state.mode = 'custom';
    state.config = cfg;
    renderMode();
    renderTemplateButtons();
    setStatus(`Loaded custom template: ${file.name}`);
  }

  async function forgetCustom() {
    await idbDelete(HANDLE_KEY);
    await storageSet({ [STORAGE.CUSTOM_CONFIG]: null, [STORAGE.CUSTOM_FILE_META]: null, [STORAGE.MODE]: 'default' });
    state.mode = 'default';
    state.config = yamlToConfig(DEFAULT_CONFIG_YAML);
    renderMode();
    renderTemplateButtons();
    setStatus('Forgot custom template and switched to default mode');
  }

  function renderMode() {
    state.modeEl.textContent = state.mode === 'custom' ? 'Cstm.' : 'Default';
  }

  function injectScheduledDate(template, data) {
    const mask = document.createElement('div');
    mask.className = 'feg-modal-mask';
    mask.innerHTML = `
      <div class="feg-modal">
        <h3>${template.name}</h3>
        <div class="feg-row"><label class="feg-label">${template.dateLabel || 'Date'}: </label><input id="feg-date-input" type="date"></div>
        <div class="feg-row" style="margin-top:10px;justify-content:flex-end">
          <button class="feg-btn" id="feg-cancel">Cancel</button>
          <button class="feg-btn feg-primary" id="feg-ok">Generate</button>
        </div>
      </div>`;
    document.body.appendChild(mask);

    mask.querySelector('#feg-cancel').onclick = () => mask.remove();
    mask.querySelector('#feg-ok').onclick = () => {
      const dateVal = mask.querySelector('#feg-date-input').value || '';
      const vars = { ...data, [template.dateVar]: dateVal };
      const subject = TemplateEngine.render(template.titleTemplate, vars);
      const body = TemplateEngine.render(template.contentTemplate, vars);
      setOutput(subject, body);
      mask.remove();
    };
  }

  function openTravelModal(data) {
    const t = state.config.travelApproval || {};
    const locations = Array.isArray(t.locations) ? t.locations : [];
    const billing = Array.isArray(t.billingTypes) ? t.billingTypes : [];

    const mask = document.createElement('div');
    mask.className = 'feg-modal-mask';
    const locationOptions = locations.map((x) => `<option value="${x}">`).join('');
    const billingOptions = billing.map((x) => `<option value="${x}">${x}</option>`).join('');

    mask.innerHTML = `
      <div class="feg-modal">
        <h3>${t.buttonName || 'Travel Approval'}</h3>
        <div class="feg-grid">
          <div class="full"><label>Reason</label><textarea id="feg-ta-reason" rows="3"></textarea></div>
          <div><label>Dates (comma separated)</label><input id="feg-ta-dates" placeholder="2026-05-12, 2026-05-13"></div>
          <div><label>Billing Type</label><select id="feg-ta-billing"><option value=""></option>${billingOptions}</select></div>
          <div><label>From</label><input id="feg-ta-from" list="feg-locations"></div>
          <div><label>To</label><input id="feg-ta-to" list="feg-locations"></div>
          <datalist id="feg-locations">${locationOptions}</datalist>
        </div>
        <div class="feg-row" style="margin-top:10px;justify-content:flex-end">
          <button class="feg-btn" id="feg-cancel">Cancel</button>
          <button class="feg-btn feg-primary" id="feg-generate">Generate</button>
        </div>
      </div>`;

    document.body.appendChild(mask);

    mask.querySelector('#feg-cancel').onclick = () => mask.remove();
    mask.querySelector('#feg-generate').onclick = () => {
      const vars = {
        ...data,
        reason: mask.querySelector('#feg-ta-reason').value.trim(),
        dates: mask.querySelector('#feg-ta-dates').value.trim(),
        billingType: mask.querySelector('#feg-ta-billing').value,
        from: mask.querySelector('#feg-ta-from').value.trim(),
        to: mask.querySelector('#feg-ta-to').value.trim()
      };
      const subject = TemplateEngine.render(t.subjectTemplate, vars);
      const body = TemplateEngine.render(t.bodyTemplate, vars);
      setOutput(subject, body);
      mask.remove();
    };
  }

  function runPlain(template, data) {
    const subject = TemplateEngine.render(template.titleTemplate, data);
    const body = TemplateEngine.render(template.contentTemplate, data);
    setOutput(subject, body);
  }

  function runExternal(template, data) {
    const subject = state.subjectEl.value;
    const body = state.bodyEl.value;
    let url = TemplateEngine.render(template.urlTemplate, data);
    if (template.addFRDate) {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const join = url.includes('?') ? '&' : '?';
      url += `${join}frDate=${y}-${m}-${day}`;
    }
    window.open(url, template.openInNewTab ? '_blank' : '_self');
    if (template.openMailto) {
      openMailto(subject, body, data.clientEmail || '');
    }
  }

  function makeTemplateButton(name, click) {
    const btn = document.createElement('button');
    btn.className = 'feg-btn';
    btn.textContent = name;
    btn.onclick = click;
    return btn;
  }

  function renderTemplateButtons() {
    state.templateContainer.innerHTML = '';
    const data = gatherPageData();

    for (const t of state.config.plain) {
      state.templateContainer.appendChild(makeTemplateButton(t.name, () => runPlain(t, data)));
    }
    for (const t of state.config.scheduled) {
      state.templateContainer.appendChild(makeTemplateButton(t.name, () => injectScheduledDate(t, data)));
    }
    for (const t of state.config.external) {
      state.templateContainer.appendChild(makeTemplateButton(t.name, () => runExternal(t, data)));
    }
    if (state.config.travelApproval?.enabled) {
      state.templateContainer.appendChild(makeTemplateButton(state.config.travelApproval.buttonName || 'Travel Approval', () => openTravelModal(data)));
    }
  }

  function buildSampleWorkbookAndDownload() {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.config.plain), 'Plain');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.config.external), 'External');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.config.scheduled), 'Scheduled');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([state.config.travelApproval || {}]), 'TravelApproval');
    XLSX.writeFile(wb, 'FlexEmailGenerator-Templates.xlsx');
  }

  async function switchMode() {
    if (state.mode === 'default') {
      state.mode = 'custom';
      const saved = await storageGet([STORAGE.CUSTOM_CONFIG]);
      if (!saved[STORAGE.CUSTOM_CONFIG]) {
        state.mode = 'default';
        throw new Error('No custom template found. Use Pick Excel first.');
      }
      state.config = normalizeConfig(saved[STORAGE.CUSTOM_CONFIG]);
    } else {
      state.mode = 'default';
      state.config = yamlToConfig(DEFAULT_CONFIG_YAML);
    }
    await storageSet({ [STORAGE.MODE]: state.mode });
    renderMode();
    renderTemplateButtons();
    setStatus(`Switched to ${state.mode} mode`);
  }

  async function toggleFixed() {
    state.panelFixed = !state.panelFixed;
    state.panel.classList.toggle('feg-flex', !state.panelFixed);
    await storageSet({ [STORAGE.PANEL_FIXED]: state.panelFixed });
    setStatus(state.panelFixed ? 'Panel mode: Fix' : 'Panel mode: Flex');
  }

  async function togglePanelVisible() {
    state.panelVisible = !state.panelVisible;
    state.root.style.display = state.panelVisible ? 'block' : 'none';
    await storageSet({ [STORAGE.PANEL_VISIBLE]: state.panelVisible });
  }

  function bindToolbar() {
    document.getElementById('feg-mode-btn').onclick = async () => {
      try {
        await switchMode();
      } catch (e) {
        setStatus(e.message, true);
      }
    };
    document.getElementById('feg-pick-btn').onclick = async () => {
      try {
        await pickCustomExcel();
      } catch (e) {
        setStatus(e.message, true);
      }
    };
    document.getElementById('feg-reload-btn').onclick = async () => {
      try {
        await loadCustomByHandle();
      } catch (e) {
        setStatus(e.message, true);
      }
    };
    document.getElementById('feg-forget-btn').onclick = async () => {
      try {
        await forgetCustom();
      } catch (e) {
        setStatus(e.message, true);
      }
    };
    document.getElementById('feg-download-btn').onclick = () => buildSampleWorkbookAndDownload();
    document.getElementById('feg-copy-btn').onclick = async () => {
      try {
        await copyOutput();
      } catch (e) {
        setStatus(e.message, true);
      }
    };
    document.getElementById('feg-mailto-btn').onclick = () => {
      const data = gatherPageData();
      openMailto(state.subjectEl.value, state.bodyEl.value, data.clientEmail || '');
    };
    document.getElementById('feg-collapse-btn').onclick = () => {
      state.panel.classList.toggle('feg-collapsed');
    };
    document.getElementById('feg-close-btn').onclick = () => togglePanelVisible();
    document.getElementById('feg-flex-btn').onclick = () => toggleFixed();
  }

  function installUI() {
    const root = document.createElement('div');
    root.id = 'feg-root';
    root.innerHTML = `
      <section id="feg-panel" class="feg-flex">
        <div class="feg-head">
          <span>Flex Email Generator</span>
          <div class="feg-head-actions">
            <button class="feg-btn" id="feg-flex-btn">Flex/Fix</button>
            <button class="feg-btn" id="feg-collapse-btn">—</button>
            <button class="feg-btn feg-danger" id="feg-close-btn">×</button>
          </div>
        </div>
        <div class="feg-body">
          <div class="feg-toolbar">
            <button class="feg-btn" id="feg-mode-btn">Mode: <span id="feg-mode-badge" class="feg-badge">Default</span></button>
            <button class="feg-btn" id="feg-download-btn">Download template</button>
            <button class="feg-btn" id="feg-pick-btn">Pick Excel</button>
            <button class="feg-btn" id="feg-reload-btn">Reload</button>
            <button class="feg-btn" id="feg-forget-btn">Forget</button>
          </div>
          <div class="feg-divider"></div>
          <div class="feg-templates" id="feg-templates"></div>
          <div class="feg-divider"></div>
          <div class="feg-output">
            <label>Subject</label>
            <textarea id="feg-subject"></textarea>
            <label>Body</label>
            <textarea id="feg-body"></textarea>
            <div class="feg-row" style="margin-top:6px">
              <button class="feg-btn feg-primary" id="feg-copy-btn">Copy</button>
              <button class="feg-btn" id="feg-mailto-btn">Open mailto</button>
            </div>
          </div>
          <div class="feg-small" id="feg-status"></div>
        </div>
      </section>`;
    document.documentElement.appendChild(root);

    state.root = root;
    state.panel = root.querySelector('#feg-panel');
    state.subjectEl = root.querySelector('#feg-subject');
    state.bodyEl = root.querySelector('#feg-body');
    state.statusEl = root.querySelector('#feg-status');
    state.modeEl = root.querySelector('#feg-mode-badge');
    state.templateContainer = root.querySelector('#feg-templates');
    bindToolbar();
  }

  async function initializeState() {
    const saved = await storageGet(Object.values(STORAGE));
    state.mode = saved[STORAGE.MODE] || 'default';
    state.panelVisible = saved[STORAGE.PANEL_VISIBLE] !== false;
    state.panelFixed = !!saved[STORAGE.PANEL_FIXED];

    if (state.mode === 'custom' && saved[STORAGE.CUSTOM_CONFIG]) {
      try {
        state.config = normalizeConfig(saved[STORAGE.CUSTOM_CONFIG]);
      } catch {
        state.mode = 'default';
      }
    }

    if (!state.config) {
      state.config = yamlToConfig(DEFAULT_CONFIG_YAML);
    }
  }

  async function handleAction(action) {
    try {
      if (action === 'toggle-panel') await togglePanelVisible();
      if (action === 'switch-mode') await switchMode();
      if (action === 'pick-excel') await pickCustomExcel();
      if (action === 'reload-excel') await loadCustomByHandle();
      if (action === 'forget-excel') await forgetCustom();
      if (action === 'download-template') buildSampleWorkbookAndDownload();
      if (action === 'toggle-fixed') await toggleFixed();
    } catch (e) {
      setStatus(e.message, true);
    }
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'flex-action') {
      handleAction(msg.action);
    }
  });

  (async () => {
    try {
      await initializeState();
      installUI();
      if (!state.panelVisible) state.root.style.display = 'none';
      state.panel.classList.toggle('feg-flex', !state.panelFixed);
      renderMode();
      renderTemplateButtons();
      setStatus('Ready');
    } catch (e) {
      console.error('[FlexEmailGenerator]', e);
    }
  })();
})();
