# Kariyer Küre · Dene, Seç, Daralt

Bağımsız ideathon prototipi. Wayweft'ten ayrı bir klasör, port, veri modeli ve tarayıcı kayıt anahtarı kullanır. Wayweft'e ya da Kariyer Küre'nin canlı sistemine bağlanmaz.

**Çalışan demo:** https://kariyerkure-rota-ideathon.vercel.app/

## Açmak

**Sunum için:** `SUNUMU-AC.cmd` dosyasını açın; ardından **http://127.0.0.1:3100** adresine gidin. Açılan pencereyi sunum sırasında kapatmayın. Hazır `dist` klasörü ve Node.js ile internet veya paket kurulumu gerektirmez. Sayfayı dosya olarak çift tıklamak yerine yerel sunucuyla açın.

**Geliştirme için:**

```powershell
npm ci
npm run dev
```

**Kontroller:** `npm test` ve `npm run build`.

Port 3100 Wayweft'in 3000 portundan ayrıdır. `localhost` ve `127.0.0.1` tarayıcıda farklı kayıt alanlarıdır; sunum boyunca aynı adresi kullanın. Bu oturumda geliştirme sunucusu zaten açıksa ikinci kez başlatmak yerine bağlantıyı açın.

## Üç dakikalık demo

1. İlk ekrandan altı soruyu cevaplayın. Hedef sorusunda Bilgisayar bölümünü, üniversitelerden ODTÜ ve İTÜ’yü seçin. Tercihlerim’den daha sonra da düzenlenebilir.
2. İlk fırsatı inceleyin. Hazırlık işlerini ve rolü onaylayıp rotaya ekleyin. Doğrudan görev atanmadığını gösterin.
3. Technovation’ı inceleyip kaydedin. Gerçek kayıt ve teslim tarihleri logolu takvime gelir; henüz görev oluşmaz. Hazırlıklarını onaylayarak rotaya ekleyin. İlerleme notunu kaydedin; rotaya ve takvime dönün. TEKNOFEST’in yeni çağrısı için kendi kontrol gününüzü seçebilirsiniz.
4. İlk çalışmanın hazırlık tarihini/saatini değiştirin. Takvimde aynı değişikliği görün. Takvimden bir işi tamamlayıp rotaya dönebilirsiniz.
5. Üç hazırlık işini tamamlayın. Gerçek hayatta yapılmış bir deneyimi **simüle ettiğinizi açıklayarak** deneyim değerlendirmesini doldurun. Kendi notunuzu kaydedin.
6. Deneyimlerim'de özeti önce inceleyin, paylaşımı onaylayın ve görüşme isteyin. PDR görünümünde yanıt verin; öğrenci görünümünde yanıtı görün.
7. Demo kontrollerinden Ege / 11. sınıf senaryosuna geçin: sınav kaynakları, bölüm araştırması ve TYT/AYT kayıt alanını gösterin. Senaryo değiştirmek mevcut demo kaydını temizler.

## Gerçekten çalışan

- Altı cevap; sınıf, hedef kategorisi, ilgi, deneyim, ilk hareket ve erişim koşullarına bağlı deterministik eşleştirme.
- 14 bölüm/alan seçeneği ve resmî logolu 7 üniversite. Bölüm–alan eşleşmesi öneri sırasını değiştirir; üniversite prestijine göre uydurma yarışma/kabul ilişkisi kurulmaz.
- Toplam 23 kayıt: 10 gerçek yarışma, resmî sınav/bölüm kaynakları ve etiketli okul senaryoları. Açık çağrı ve yeni çağrısı beklenen dönemler ayrıdır. Ücreti doğrulanmamış kayıt ücretsiz sayılmaz.
- Kurum logolu takvim: yarışma son tarihi, teslim, kişisel hazırlık ve çağrı kontrol günü ayrı kayıt türleridir. Saatli son tarihler Türkiye saatine çevrilir.
- Çalışma durumları ve tarihli ilerleme notları. “Başvurdum” öğrencinin beyanıdır. Hazırlık işaretlemek otomatik katılım veya başarı üretmez.
- Hazırlık–10 için deneyim; 11–12 için sınav ve bölüm araştırmasına ağırlık veren sıralama.
- Uygunluk filtreleri, gerekçeler, arama, tür ve kaydedilen filtresi.
- Ayrı kaydetme, rotaya ekleme, hazırlık tamamlama ve deneyim değerlendirme durumları.
- Düzenlenebilir hazırlık işleri; duraklatma ve rotadan çıkarma.
- Küçük denemeler için aynı gün içinde kısa oturumlar; hazırlık süreleri fırsatın haftalık zaman bütçesini aşmadan dağıtılır. Bunlar değiştirilebilir öneri saatleridir.
- Ay takvimi, son tarihler, hazırlık oturumları ve `.ics` dışa aktarım. Otomatik takvim senkronizasyonu yoktur.
- “Devam”, “başka rol”, “başka alan”, “ara ver” tercihlerinin sonraki önerilere yansıması.
- Açık onaydan sonra paylaşılan öğretmen özeti, ekip talebi, yerel yanıt döngüsü.
- Sürümlü ve doğrulanan tarayıcı kaydı; bozuk/kısıtlı kayıt alanında açıklayıcı geri bildirim.
- Defne, Deniz ve Ege demoları; açık onaylı demo sıfırlama.

## Bilerek simülasyon olan

- Canlı AI yok. Serbest hedef metni semantik modelle çözümlenmez; seçilen bölüm kimlikleri, ilgi ve uygunluk kuralları kullanılır.
- Okul etkinlikleri, kurum adları ve tarihleri örnektir. Gerçek yarışmaların dönem/tarih kaynakları 22 Ekim 2026’da kontrol edildi (SOURCES.md). Başvurudan önce yaş, ekip, danışman, ücret ve güncel şartname yeniden doğrulanmalıdır. Okul sınıfı tek başına tam uygunluk ispatlamaz.
- Tarihsiz kaynağa son başvuru tarihi uydurulmaz. Sunum zamanı 24 Ekim 2026'ya sabittir.
- Gerçek kayıt, dosya yükleme, başvuru, e-posta, anlık bildirim, otomatik ekip atama ve okul verisi aktarımı yapılmaz.
- PDR rol geçişi yalnızca demo kontrolüdür; gerçek kimlik doğrulama/yetkilendirme değildir. Gerçek öğrenci veya hassas veri girmeyin.
- Envanterler değiştirilmez; yetenek skoru, meslek hükmü veya netten yerleşme olasılığı üretilmez. Farklı denemeler doğrudan karşılaştırılmaz.
- KVKK uygunluğu ve pedagojik geçerlilik iddiası yoktur.

## Kariyer Küre'ye entegrasyon taslağı

Mevcut kimlik ve okul üyeliği korunarak bu modülün öğrenci ekranına eklenmesi amaçlanır. Gerçek entegrasyonda ayrı ayrı öğrenci tercihleri, katalog kayıtları, rota çalışmaları, hazırlık oturumları, deneyim gözlemleri ve paylaşım izinleri sunucuya taşınır. Öğretmen erişimi okul kapsamıyla sınırlandırılır. Paylaşım izninin kapsamı, saklama/silme süresi ve gerektiğinde geri çekme akışı tasarlanır. Bunlar prototipte çözülmüş güvenlik/uyum süreçleri değildir.

AI eklenecekse uygunluk ve tarih doğrulaması kural tabanında kalır. Model yalnızca katalog kimliklerinden seçim yapmalı, açıklama ve taslak özet üretmelidir. Öğrenci onayı olmadan görev, paylaşım veya kesin yönlendirme oluşturmamalıdır. Okul/PDR değerlendirmesi ayrıca gerekir.

## Kaynaklar ve marka

- Kariyer Küre görsel/ürün referansı: https://kariyerkurem.com/ ve https://kariyerkurem.com/nasil-calisir
- Demo içinde kullanılan logo simgesi: https://kariyerkurem.com/favicon.png
- Urbanist yazı tipi dosyaları: Kariyer Küre'nin kamuya açık `/fonts/` kaynakları. Yerel kopyalar yalnızca bağımsız, yayınlanmamış ideathon konseptinde kullanılır; bu çalışma resmî ürün olduğu veya marka izni alındığı iddiasında değildir.
- TÜBİTAK: https://tubitak.gov.tr/ · ÖSYM: https://www.osym.gov.tr/ · YÖK Atlas: https://yokatlas.yok.gov.tr/
- AYT test yapısı için resmî 2026 kitapçığı: https://cdn.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_ayt_2026_kitapcik_kt12.pdf

## Pilot fikri

Bir sınıfta iki haftalık deneme: öneri gören öğrenciler içinde gerçekten bir deneyim yapıp ne öğrendiğini kaydedenlerin oranı; ilk denemeye kadar süre; PDR görüşmesi hazırlığına ayrılan süre. Bunlar henüz ölçülmemiş hipotezlerdir, etki iddiası değildir.
