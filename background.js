const MODEL_NAME = 'gemini-2.0-flash';

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
      
      // --- YENİ EKLENDİ: Hedef kelime sayısını hesapla ---
      const originalText = request.text;
      const wordCount = originalText.split(/\s+/).length;
      const summaryLengthPercentage = parseInt(result.summaryLength || '50', 10); // Varsayılan %50
      const targetWordCount = Math.round(wordCount * (summaryLengthPercentage / 100));
      // --- BİTTİ ---

      callGeminiAPI(API_URL, originalText, targetWordCount)
        .then(summary => {
          chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: summary });
        })
        .catch(error => {
          console.error('Gemini API Hatası:', error);
          chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: `Özet alınamadı: ${error.message}` });
        });
    });

    return true; 
  }
});


async function callGeminiAPI(apiUrl, text, targetLength) {
  const maxRetries = 3;
  let delay = 1000;
  
  // Prompt  dinamik olarak gelen hedef kelime sayısını kullanıyor.
  const prompt = `Aşağıdaki metni yaklaşık ${targetLength} kelime kullanarak özetle. Eğer metin birisinin kendisi hakkında ifadesi ise, o öznesi ile özeti sun. Eğer metin genel ifadeler barındıyorsa, örneğin teknik veya eğitici bir döküman; o zaman daha genel bir dil kullan. Sadece özet metnini döndür ve metnin orijinal dilini koru(türkçe ise türkçe, ingilizec ise ingilizce özetleme yap), başka hiçbir şey ekleme:\n\n"${text}"`;

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