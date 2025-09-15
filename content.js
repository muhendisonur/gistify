let summaryPopup = null;
let manualTrigger = null;

document.addEventListener('mouseup', (event) => {
  if (event.target.id === 'gemini-manual-trigger') {
    return;
  }
  removeSummaryPopup();
  removeManualTrigger();
  
  const selectedText = window.getSelection().toString().trim();

  if (selectedText.length > 10) {
    chrome.storage.local.get(['mode'], (result) => {
      const mode = result.mode || 'automatic';

      if (mode === 'automatic') {
        triggerSummary(selectedText, event.clientX, event.clientY);
      } else {
        showManualTrigger(event.clientX, event.clientY, selectedText);
      }
    });
  }
});

document.addEventListener('mousedown', (event) => {
  if (event.target.id !== 'gemini-manual-trigger') {
      removeSummaryPopup();
      removeManualTrigger();
  }
});

function showManualTrigger(x, y, textToSummarize) {
  manualTrigger = document.createElement('div');
  manualTrigger.id = 'gemini-manual-trigger';
  manualTrigger.style.left = `${x}px`;
  manualTrigger.style.top = `${y + window.scrollY + 10}px`;

  manualTrigger.addEventListener('click', (event) => {
    event.stopPropagation();
    triggerSummary(textToSummarize, event.clientX, event.clientY);
    removeManualTrigger();
  });

  document.body.appendChild(manualTrigger);
}

function triggerSummary(text, x, y) {
  showSummaryPopup('Özetleniyor...', x, y);
  chrome.runtime.sendMessage({ action: 'summarize', text: text });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'displaySummary') {
    updateSummaryPopup(request.summary, request.timeSaved);
  }
});

function showSummaryPopup(text, x, y) {
  removeSummaryPopup();
  summaryPopup = document.createElement('div');
  summaryPopup.id = 'gemini-summary-popup';
  summaryPopup.innerHTML = `<div class="summary-content">${text}</div>`;
  summaryPopup.style.left = `${x}px`;
  summaryPopup.style.top = `${y + window.scrollY + 15}px`;
  document.body.appendChild(summaryPopup);
}

function updateSummaryPopup(summaryText, timeSavedText) {
  if (summaryPopup) {
    let contentHTML = `<div class="summary-content">${summaryText}</div>`;
    
    if (timeSavedText) {
      contentHTML += `<div class="time-saved-info">${timeSavedText}</div>`;
    }
    
    summaryPopup.innerHTML = contentHTML;
  }
}

function removeSummaryPopup() {
  if (summaryPopup) {
    summaryPopup.remove();
    summaryPopup = null;
  }
}

function removeManualTrigger() {
  if (manualTrigger) {
    manualTrigger.remove();
    manualTrigger = null;
  }
}