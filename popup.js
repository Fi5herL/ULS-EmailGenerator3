'use strict';

document.getElementById('open-generator-btn').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('generator.html') });
  window.close();
});
