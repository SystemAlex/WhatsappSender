/* global chrome */

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "OPEN_WHATSAPP") {
    if (sender.tab) {
      chrome.storage.local.set({
        appTabId: sender.tab.id,
        hasAttachment: request.hasAttachment,
      });
    }

    chrome.tabs.query({ url: "*://web.whatsapp.com/*" }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { url: request.url, active: true });
      } else {
        chrome.tabs.create({ url: request.url, active: true });
      }
    });
    sendResponse({ status: "ok" });
  }

  if (request.type === "RETURN_TO_APP") {
    chrome.storage.local.get(["appTabId"], (data) => {
      if (data.appTabId) {
        chrome.tabs.update(data.appTabId, { active: true }, () => {
          setTimeout(() => {
            chrome.tabs.sendMessage(data.appTabId, {
              type: "NEXT_STEP",
              error: request.error,
            });
          }, 500);
        });
      }
    });
    sendResponse({ status: "returning" });
  }
  return true;
});
