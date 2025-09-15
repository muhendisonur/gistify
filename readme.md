# Gemini Metin Özetleyici Chrome Eklentisi 🚀

Web sayfalarında seçtiğiniz metinleri Google Gemini API'sini kullanarak anında özetleyen bir Chrome eklentisi. Bu araç, uzun makaleleri, raporları veya herhangi bir metni hızla anlamak ve bilgiye verimli bir şekilde ulaşmak için tasarlanmıştır.

![Gemini Summarizer Demo](demo.gif)

## ✨ Özellikler

* **Esnek Özetleme Seçenekleri:** Metinleri tek bir tıkla orijinal uzunluğunun **~%75 (Uzun)**, **~%50 (Orta)** veya **~%30 (Kısa)** oranında özetleyin.
* **Çift Çalışma Modu:**
    * **Otomatik Mod:** Metni seçtiğiniz anda özet anında belirir.
    * **Manuel Mod:** Metni seçtikten sonra çıkan ikona tıklayarak özeti sadece istediğinizde görünür kılın.
* **Akıllı ve Bağlama Uygun Özetler:** Gelişmiş prompt engineering teknikleri sayesinde, eklenti metnin ruhunu anlar ve size en uygun üslupla bir özet sunar.
* **Sayfa Üzerinde Gösterim:** Özet, okuma akışınızı bozmadan, seçtiğiniz metnin yanında şık bir baloncuk içinde gösterilir.
* **Kullanıcı Dostu Ayarlar Paneli:** Eklenti ikonuna tıklayarak açılan panelden çalışma modunu, özet uzunluğunu ve API anahtarınızı kolayca yönetin.
* **Güvenli API Anahtarı Yönetimi:** Gemini API anahtarınız, tarayıcınızın yerel depolama alanında güvenli bir şekilde saklanır.

## 🛠️ Teknoloji Stack

* **JavaScript (ES6+)**
* **HTML5 / CSS3**
* **Chrome Extension API (Manifest V3)**
* **Google Gemini API**

## 🔧 Kurulum

Bu eklentiyi yerel makinenizde test etmek ve geliştirmek için aşağıdaki adımları izleyin:

1.  **Projeyi Klonlayın:**
    ```bash
    git clone [https://github.com/kullanici-adiniz/proje-adiniz.git](https://github.com/kullanici-adiniz/proje-adiniz.git)
    ```
2.  **Chrome Eklentiler Sayfasını Açın:**
    Tarayıcınızın adres çubuğuna `chrome://extensions` yazın ve Enter'a basın.

3.  **Geliştirici Modunu Etkinleştirin:**
    Sağ üst köşede bulunan "Geliştirici modu" (Developer mode) anahtarını aktif hale getirin.

4.  **Eklentiyi Yükleyin:**
    Sol üstte beliren "Paketlenmemiş öğe yükle" (Load unpacked) butonuna tıklayın ve klonladığınız proje klasörünü seçin.

5.  Eklenti artık tarayıcınızın eklentiler çubuğunda görünecektir!

## 👨‍💻 Kullanım

1.  **API Anahtarını Yapılandırın:**
    * Tarayıcınızdaki eklenti ikonuna tıklayarak ayarlar panelini açın.
    * Google AI Studio üzerinden aldığınız **Gemini API Anahtarınızı** ilgili alana yapıştırın.
    * "Kaydet ve Test Et" butonuna basarak anahtarınızın geçerliliğini kontrol edin.

2.  **Ayarları Seçin:**
    * **Çalışma Modu:** `Otomatik` veya `Manuel` modlarından birini seçin.
    * **Özet Uzunluğu:** İhtiyacınıza uygun özetleme oranını seçin.
    * Seçimleriniz otomatik olarak kaydedilecektir.

3.  **Metinleri Özetleyin:**
    * Herhangi bir web sayfasında özetlemek istediğiniz bir metni farenizle seçin.
    * Seçtiğiniz moda göre özet ya anında belirecek ya da ikona tıkladığınızda görünecektir.

## 🤝 Katkıda Bulunma

Katkılarınız projeyi daha iyi hale getirecektir! Hata bildirimleri, yeni özellik önerileri ve pull request'ler her zaman kabul edilir. Lütfen katkıda bulunmadan önce `CONTRIBUTING.md` dosyasını inceleyin.

1.  Projeyi Fork'layın.
2.  Yeni bir Feature Branch oluşturun (`git checkout -b feature/AmazingFeature`).
3.  Değişikliklerinizi Commit'leyin (`git commit -m 'Add some AmazingFeature'`).
4.  Branch'inizi Push'layın (`git push origin feature/AmazingFeature`).
5.  Bir Pull Request açın.

## 📜 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.
