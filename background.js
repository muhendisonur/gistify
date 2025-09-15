const MODEL_NAME = 'gemini-1.5-flash-latest';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    // Hem API anahtarını hem de özet uzunluğunu al
    chrome.storage.local.get(['geminiApiKey', 'summaryLength'], (result) => {
      const apiKey = result.geminiApiKey;

      if (!apiKey) {
        const errorMessage = "Gemini API anahtarı bulunamadı. Lütfen eklenti ikonuna tıklayıp anahtarınızı kaydedin.";
        chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: errorMessage });
        return;
      }
      
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
      
      const originalText = request.text;
      const wordCount = originalText.split(/\s+/).length;
      const summaryLengthPercentage = parseInt(result.summaryLength || '50', 10); // Varsayılan %50
      const targetWordCount = Math.round(wordCount * (summaryLengthPercentage / 100));

      callGeminiAPI(API_URL, originalText, targetWordCount)
        .then(summary => {
          const timeSavedString = calculateTimeSaved(originalText, summary);
          chrome.tabs.sendMessage(sender.tab.id, { 
            action: 'displaySummary', 
            summary: summary,
            timeSaved: timeSavedString
          });
        })
        .catch(error => {
          console.error('Gemini API Hatası:', error);
          chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: `Özet alınamadı: ${error.message}` });
        });
    });

    return true; 
  }
});

function calculateTimeSaved(originalText, summaryText) {
  const WPM = 225;
  const originalWordCount = originalText.split(/\s+/).length;
  const summaryWordCount = summaryText.split(/\s+/).length;

  const wordsSaved = originalWordCount - summaryWordCount;
  if (wordsSaved <= 0) return null;

  const secondsSaved = Math.round((wordsSaved / WPM) * 60);

  if (secondsSaved < 60) {
    return `Yaklaşık ${secondsSaved} saniye tasarruf ettiniz.`;
  } else {
    const minutes = Math.floor(secondsSaved / 60);
    const seconds = secondsSaved % 60;
    return `Yaklaşık ${minutes} dakika ${seconds} saniye tasarruf ettiniz.`;
  }
}

async function callGeminiAPI(apiUrl, text, targetLength) {
  const maxRetries = 3;
  let delay = 1000;
  
  const prompt = `Aşağıdaki metni yaklaşık ${targetLength} kelime kullanarak özetle. Sadece özet metnini döndür, başka hiçbir şey ekleme:\n\n"${text}"`;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!response.ok) {
        if (response.status === 429 || response.status === 503) {
          throw new Error('The model is overloaded.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error.message || `API'den geçersiz yanıt alındı.`);
      }
      const data = await response.json();
      const summary = data.candidates[0].content.parts[0].text;
      return summary.trim();
    } catch (error) {
      if (error.message.includes('overloaded') && i < maxRetries - 1) {
        console.log(`Model aşırı yüklü. ${delay / 1000} saniye sonra tekrar denenecek...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}