/* global chrome */

document.documentElement.dataset.waExtensionInstalled = "true";

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "WA_SENDER_START_SINGLE") {
    chrome.storage.local.set(
      { currentHasAttachment: event.data.hasAttachment },
      () => {
        chrome.runtime.sendMessage({
          type: "OPEN_WHATSAPP",
          url: event.data.url,
        });
      },
    );
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

  const storageData = await chrome.storage.local.get(["currentHasAttachment"]);
  const hasAttachment = storageData.currentHasAttachment;

  let successSignal = null;
  const startTime = Date.now();
  const MAX_WAIT = 60000;

  console.log("Esperando panel de conversación...");

  while (Date.now() - startTime < MAX_WAIT) {
    successSignal = document.querySelector(
      '#main[data-testid="conversation-panel-wrapper"]',
    );
    if (successSignal) {
      console.log("¡Chat detectado! Iniciando flujo de envío...");
      break;
    }
    await wait(2000);
  }

  if (!successSignal) {
    console.error("No se detectó el chat tras 60s. Reportando como inválido.");
    chrome.runtime.sendMessage({
      type: "RETURN_TO_APP",
      error: "INVALID_NUMBER",
    });
    return;
  }

  try {
    if (hasAttachment) {
      let chatBox = null;
      while (!chatBox) {
        chatBox =
          document.querySelector('footer div[role="textbox"]') ||
          document.querySelector('div[contenteditable="true"][data-tab="10"]');
        if (!chatBox) await wait(2000);
        else break;
      }

      chatBox.focus();
      document.execCommand("paste");
      console.log("Archivo pegado. Esperando botón de envío de medios...");

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
    } else {
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
    }

    await wait(3000);
    chrome.runtime.sendMessage({ type: "RETURN_TO_APP" });
  } catch (err) {
    console.error("Error en el flujo de envío:", err);
    chrome.runtime.sendMessage({
      type: "RETURN_TO_APP",
      error: "SEND_FLOW_ERROR",
    });
  }
}

if (window.location.host.includes("whatsapp.com")) {
  runSequence();
}
