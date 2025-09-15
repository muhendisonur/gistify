// Sayfadaki elementleri takip etmek için global değişkenler
let summaryPopup = null;
let manualTrigger = null;

// Kullanıcı metin seçmeyi bitirdiğinde
document.addEventListener('mouseup', (event) => {
  // Eğer tıklama bizim manuel simgemizin üzerindeyse hiçbir şey yapma
  if (event.target.id === 'gemini-manual-trigger') {
    return;
  }

  // Önceki pop-up ve simgeleri temizle
  removeSummaryPopup();
  removeManualTrigger();
  
  const selectedText = window.getSelection().toString().trim();

  // Yeterince uzun bir metin seçilmişse
  if (selectedText.length > 10) {
    // Kayıtlı modu kontrol et
    chrome.storage.local.get(['mode'], (result) => {
      const mode = result.mode || 'automatic'; // Varsayılan: otomatik

      if (mode === 'automatic') {
        // OTOMATİK MOD: Direkt özetle
        triggerSummary(selectedText, event.clientX, event.clientY);
      } else {
        // MANUEL MOD: Tıklanabilir simgeyi göster
        showManualTrigger(event.clientX, event.clientY, selectedText);
      }
    });
  }
});

// Sayfada herhangi bir yere basıldığında pop-up ve simgeleri kaldır
document.addEventListener('mousedown', (event) => {
  if (event.target.id !== 'gemini-manual-trigger') {
      removeSummaryPopup();
      removeManualTrigger();
  }
});

// MANUEL MOD: Tıklanabilir simgeyi oluşturur
function showManualTrigger(x, y, textToSummarize) {
  manualTrigger = document.createElement('div');
  manualTrigger.id = 'gemini-manual-trigger';
  manualTrigger.style.left = `${x}px`;
  manualTrigger.style.top = `${y + window.scrollY + 10}px`;

  // Simgeye tıklandığında özetleme işlemini başlat
  manualTrigger.addEventListener('click', (event) => {
    event.stopPropagation(); // Sayfanın mousedown olayını tetiklemesini engelle
    triggerSummary(textToSummarize, event.clientX, event.clientY);
    removeManualTrigger();
  });

  document.body.appendChild(manualTrigger);
}

// Özetleme sürecini başlatan fonksiyon (her iki mod için de ortak)
function triggerSummary(text, x, y) {
  showSummaryPopup('Özetleniyor...', x, y);
  chrome.runtime.sendMessage({ action: 'summarize', text: text });
}

// Arka plandan gelen özet mesajını dinle
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'displaySummary') {
    if (summaryPopup) {
      summaryPopup.textContent = request.summary;
    }
  }
});

// Pop-up elementini gösterir
function showSummaryPopup(text, x, y) {
  removeSummaryPopup(); // Önce varsa eskiyi kaldır
  summaryPopup = document.createElement('div');
  summaryPopup.id = 'gemini-summary-popup';
  summaryPopup.textContent = text;
  summaryPopup.style.left = `${x}px`;
  summaryPopup.style.top = `${y + window.scrollY + 15}px`;
  document.body.appendChild(summaryPopup);
}

// Elementleri sayfadan temizleyen yardımcı fonksiyonlar
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