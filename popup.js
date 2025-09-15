document.addEventListener('DOMContentLoaded', () => {
  // Elementleri seç
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveButton = document.getElementById('saveButton');
  const statusMessage = document.getElementById('statusMessage');
  
  // Mod Seçenekleri
  const autoModeRadio = document.getElementById('autoMode');
  const manualModeRadio = document.getElementById('manualMode');
  const modeRadios = [autoModeRadio, manualModeRadio];

  // Uzunluk Seçenekleri
  const len75Radio = document.getElementById('len75');
  const len50Radio = document.getElementById('len50');
  const len30Radio = document.getElementById('len30');
  const lengthRadios = [len75Radio, len50Radio, len30Radio];

  // --- AYARLARI YÜKLE ---
  // Kayıtlı ayarları yükle, yoksa varsayılanları kullan
  chrome.storage.local.get(['mode', 'summaryLength'], (result) => {
    // Modu yükle (varsayılan: automatic)
    if (result.mode === 'manual') {
      manualModeRadio.checked = true;
    } else {
      autoModeRadio.checked = true;
    }
    // Uzunluğu yükle (varsayılan: 50)
    if (result.summaryLength === '75') {
      len75Radio.checked = true;
    } else if (result.summaryLength === '30') {
      len30Radio.checked = true;
    } else {
      len50Radio.checked = true;
    }
  });

  // --- AYARLARI KAYDET ---
  // Mod seçimi değiştiğinde kaydet
  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      chrome.storage.local.set({ mode: radio.value });
    });
  });

  // Uzunluk seçimi değiştiğinde kaydet
  lengthRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      chrome.storage.local.set({ summaryLength: radio.value });
    });
  });

  // --- API ANAHTARI YÖNETİMİ ---
  chrome.storage.local.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) apiKeyInput.value = result.geminiApiKey;
  });

  saveButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) return showMessage('Lütfen bir API anahtarı girin.', 'error');
    
    showMessage('API Anahtarı Test Ediliyor...', 'testing');
    saveButton.disabled = true;
    try {
      await validateApiKey(apiKey);
      chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
        showMessage('API Kullanılabilir! Kaydedildi.', 'success');
        setTimeout(() => window.close(), 1500);
      });
    } catch (error) {
      showMessage(`Hata: ${error.message}`, 'error');
    } finally {
      saveButton.disabled = false;
    }
  });

  function showMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
  }
});

async function validateApiKey(apiKey) {
    const validationUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
      const response = await fetch(validationUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Geçersiz API Anahtarı.');
      }
    } catch (networkError) {
      throw new Error('API\'ye ulaşılamadı. İnternet bağlantınızı kontrol edin.');
    }
}