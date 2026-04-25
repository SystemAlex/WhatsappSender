/* global chrome */

document.documentElement.dataset.waExtensionInstalled = "true";

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "WA_SENDER_START_SINGLE") {
    chrome.runtime.sendMessage({
      type: "OPEN_WHATSAPP",
      url: event.data.url,
    });
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "NEXT_STEP") {
    window.postMessage({ type: "WA_SENDER_NEXT" }, "*");
  }
});

async function runSequence() {
  if (!window.location.href.includes("web.whatsapp.com/send")) return;
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  let chatBox = null;
  while (!chatBox) {
    chatBox =
      document.querySelector('footer div[role="textbox"]') ||
      document.querySelector('div[contenteditable="true"][data-tab="10"]');
    if (!chatBox) await wait(2000);
    else break;
  }

  try {
    let sendTextBtn = null;
    while (!sendTextBtn) {
      sendTextBtn =
        document.querySelector('button[aria-label="Enviar"]') ||
        document
          .querySelector('[data-testid="wds-ic-send-filled"]')
          ?.closest("button");
      if (!sendTextBtn) await wait(2000);
      else break;
    }
    sendTextBtn.click();

    await wait(2000);

    chatBox.focus();
    document.execCommand("paste");

    let sendAttachBtn = null;
    while (!sendAttachBtn) {
      sendAttachBtn =
        document.querySelector('div[role="button"][aria-label*="Enviar"]') ||
        document
          .querySelector('[data-testid="wds-ic-send-filled"]')
          ?.closest('[role="button"]');
      if (!sendAttachBtn) await wait(2000);
      else break;
    }

    sendAttachBtn.click();
    await wait(3000);

    chrome.runtime.sendMessage({ type: "RETURN_TO_APP" });
  } catch (err) {
    console.error("Error en secuencia:", err);
  }
}

if (window.location.host.includes("whatsapp.com")) {
  runSequence();
}
