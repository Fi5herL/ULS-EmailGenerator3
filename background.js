'use strict';

const MENU_IDS = {
  TOGGLE_PANEL: 'flex-toggle-panel',
  SWITCH_MODE: 'flex-switch-mode',
  PICK_EXCEL: 'flex-pick-excel',
  RELOAD_EXCEL: 'flex-reload-excel',
  FORGET_EXCEL: 'flex-forget-excel',
  DOWNLOAD_TEMPLATE: 'flex-download-template',
  TOGGLE_FIXED: 'flex-toggle-fixed'
};

const ACTION_BY_MENU = {
  [MENU_IDS.TOGGLE_PANEL]: 'toggle-panel',
  [MENU_IDS.SWITCH_MODE]: 'switch-mode',
  [MENU_IDS.PICK_EXCEL]: 'pick-excel',
  [MENU_IDS.RELOAD_EXCEL]: 'reload-excel',
  [MENU_IDS.FORGET_EXCEL]: 'forget-excel',
  [MENU_IDS.DOWNLOAD_TEMPLATE]: 'download-template',
  [MENU_IDS.TOGGLE_FIXED]: 'toggle-fixed'
};

function createMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_IDS.TOGGLE_PANEL,
      title: 'Flex Email: Toggle Panel',
      contexts: ['page'],
      documentUrlPatterns: ['https://portal.ul.com/Project/Details/*']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.SWITCH_MODE,
      title: 'Flex Email: Switch Default/Custom Mode',
      contexts: ['page'],
      documentUrlPatterns: ['https://portal.ul.com/Project/Details/*']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.PICK_EXCEL,
      title: 'Flex Email: Pick Excel Template',
      contexts: ['page'],
      documentUrlPatterns: ['https://portal.ul.com/Project/Details/*']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.RELOAD_EXCEL,
      title: 'Flex Email: Reload Custom Template',
      contexts: ['page'],
      documentUrlPatterns: ['https://portal.ul.com/Project/Details/*']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.FORGET_EXCEL,
      title: 'Flex Email: Forget Custom Template',
      contexts: ['page'],
      documentUrlPatterns: ['https://portal.ul.com/Project/Details/*']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.DOWNLOAD_TEMPLATE,
      title: 'Flex Email: Download Excel Template',
      contexts: ['page'],
      documentUrlPatterns: ['https://portal.ul.com/Project/Details/*']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.TOGGLE_FIXED,
      title: 'Flex Email: Toggle Flex/Fix',
      contexts: ['page'],
      documentUrlPatterns: ['https://portal.ul.com/Project/Details/*']
    });
  });
}

chrome.runtime.onInstalled.addListener(createMenus);
chrome.runtime.onStartup.addListener(createMenus);

function sendAction(tabId, action) {
  if (!tabId || !action) return;
  chrome.tabs.sendMessage(tabId, { type: 'flex-action', action }, () => {
    void chrome.runtime.lastError;
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const action = ACTION_BY_MENU[info.menuItemId];
  if (action && tab?.id) {
    sendAction(tab.id, action);
  }
});

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs?.[0];
    if (!tab?.id || !tab.url?.startsWith('https://portal.ul.com/Project/Details/')) return;
    if (command === 'toggle-panel') sendAction(tab.id, 'toggle-panel');
    if (command === 'switch-mode') sendAction(tab.id, 'switch-mode');
    if (command === 'reload-custom-template') sendAction(tab.id, 'reload-excel');
  });
});
