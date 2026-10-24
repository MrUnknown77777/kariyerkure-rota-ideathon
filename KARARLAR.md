# Kariyer Küre Rota: Ana Belge

**Sürüm:** v0.2 (prototip geliştirmesi başladı) · **Tarih:** 24 Ekim 2026, 12:30
**Takım:** İstikbalin Cezerileri: Eymen Efe Çetin, Mustafa Ensar Erol, Ali Baha Demir · Danışman: Vedat Şahin
**Kod tabanı:** github.com/MrUnknown77777/kariyerkure-rota-ideathon (fork; başlangıç etiketi `baslangic` = 5c1e24a)

---

## 0. Bu belge nasıl okunur?

**Karar durumu etiketleri**
- **[KESİN]** Eymen'in açıkça onayladığı karar. Ancak Eymen'in onayıyla ve değişiklik günlüğüne yazılarak değişir.
- **[ÖNERİ]** Claude'un önerisi. Onay bekler, kesinleşmiş gibi uygulanmaz.
- **[AÇIK]** Henüz karar verilmedi.

**Kanıt etiketleri**
- **(D)** Doğrulanmış: birincil kaynak ya da kendi doğrudan gözlemimiz.
- **(G)** Güçlü kanıt: güvenilir ikincil kaynak.
- **(H)** Hipotez: sınanmadı, pilotta ölçülecek.
- **(B)** Belirsiz ya da çelişkili.
- **(P)** Prototip gerektirir.

**Gerçeklik düzeyi** (her işlev için)
- **Çalışan:** Prototipte kullanıcı etkileşimiyle gerçekten çalışır.
- **Simüle:** Örnek veri ya da hazır senaryoyla temsil edilir.
- **Gelecek:** Yalnızca tasarlanır ve sunumda anlatılır, kodlanmaz.

---

## 1. Kapsamı belirleyen dış koşullar (D)

| Kaynak | İçerik | Bu belgeye etkisi |
|---|---|---|
| Yarışma yönergesi (24 Eki) | Ana soru: "Kariyerküre'yi öğrencilerin düzenli ve isteyerek kullandıkları, okul rehberlik çalışmalarını destekleyen bir uygulamaya nasıl dönüştürebiliriz?" **Tek bir temel sorun** seçilecek. Odak: kullanıcı deneyimi, düzenli katılım, rehberlik süreçleri. "Hedefiniz çok sayıda özellik önermek değil." | Ürün tanımı tek bir soruna bağlanır; diğer fikirler bu sorunun alt bileşeni ya da yol haritası olur |
| Yönerge, sunum başlıkları | 1) Takım ve çözüm adı · 2) Sorun ve hedef kullanıcı · 3) Gözlem veya senaryo · 4) İşleyiş ve görsel · 5) Kariyerküre'ye entegrasyon · 6) Fayda ve ölçüm. Kaynaklar ve yapay zekâ desteği belirtilecek | Sunum iskeleti |
| Yönerge, değerlendirme | Sorun tanımı, ihtiyaca uygunluk, özgünlük, uygulanabilirlik, entegrasyon, etki, sunumun açıklığı, öğrencilerin aktif katılımı | Karar ölçütleri (Bölüm 6) |
| Kurum slaytı "Fikrini Kendi Tarzınla Anlat" | 4 soru: Hangi ihtiyacı fark ettiniz? Fikriniz nedir, kimlere fayda sağlar? Bir örnekle nasıl kullanılır? Kariyerküre deneyimini nasıl geliştirir? "Teknik bir çözüm geliştirmeniz beklenmemektedir." Çizim, hikâye, canlandırma, ekran tasarımı ya da sunum kabul ediliyor | Prototip bir **kanıt ve anlatım aracıdır**, üretim yazılımı değildir. Mimari, "gelecek" düzeyinde anlatılır |
| Saat programı | Oturum 2: 13:15–14:15 · Dosya teslimi: 14:30–15:00 · Jüri: 15:00–16:30 | Kod 14:00'te dondurulur |
| **[AÇIK]** | Sunum süresi ve dosya biçimi | Anlatım metni bu bilgiye göre yazılacak |

---

## 2. Çıktı 1: Proje envanteri

### 2.1 Mevcut 15 fikir

Kaynak: "Kariyerküre Ideathon: Nihai Fikir Listesi" (23 Eki). Demodaki durum, kod incelemesine (D) dayanır. Kariyer Küre'deki durum, 23–24 Ekim'deki öğrenci ve okul paneli incelemelerine (D) dayanır.

| ID | Fikir | Demoda (fork) | Kariyer Küre'de gözlenen | Durum |
|---|---|---|---|---|
| A1 | İlgiye göre fırsat önerisi (Fırsat Radarı) | Var: `engine.ts` uygunluk ve sıralama, `catalog.ts` + `competitions.ts` (23 kayıt, 10 gerçek yarışma, 22 Eki doğrulamalı) | Fırsatlar bölümünün 4 sekmesi de boş | [KESİN] Konum filtresi eklenecek. Alt ilgi etiketleri [AÇIK] (sonraya bırakma önerisi var) |
| A2 | "Neden sana?" ve uygunluk | Var, ama gerekçe cümlesi tekrar ediyor | Meslek eşleştirmede gerekçe var; fırsatlarda yok | [KESİN] Gerekçe sırası, tekrar önleme, uymayan kartta tek satırlık neden, "Neden sana?" başlığı |
| A3 | Takvim ve başvuru hatırlatmaları | Var: ay takvimi, son tarih, kontrol günü, `.ics`. Anlık bildirim yok | Takvim yalnızca görüşmeler için | [ÖNERİ] Simüle hatırlatma bildirimi |
| A4 | Geri sayımlı hazırlık planı | Var: haftalık zamana dağıtılmış işler (`createTrack`) | Yol Haritası görevleri var, dış fırsata bağlı değil | [ÖNERİ] Olduğu gibi göster |
| A5 | "Bugün" ekranı | Kısmen: Rotam'da 6 blok | 18 menü maddesi, 3 ayrı "yolculuk" | [ÖNERİ] Rotam 3 bloğa iner |
| B1 | Okulun fırsat panosu | Yok, ama örnek okul etkinlikleri var | **Okul panelinde "Atölye & Etkinlik" modülü var** (katılım işaretlenince kredi yazılıyor) | [ÖNERİ] Rozet ve entegrasyon anlatımı |
| B2 | Rehber öğretmen köprüsü | Var: öğrenci onaylı özet, ekip ya da görüşme talebi, PDR yanıtı (`TeacherPage`) | Randevu, müsaitlik, yapay zekâ ön bilgi notu, Erken Uyarı (yalnızca olumsuz sinyaller) | [ÖNERİ] "Sınıfın fırsat özeti" kartı. Y1 ile birleşir (Bölüm 3) |
| B3 | 5 dakikada başlangıç | Var: 6 soru (`Onboarding.tsx`) | İlk eşleşme için 8 adım ve ~360 soru gerekiyor | [ÖNERİ] Şehir sorusu eklenecek |
| B4 | Deneyimden öğrenen profil | Var: değerlendirme, "devam / başka rol / başka alan / ara ver" | Görev rubrikle puanlanıyor; öğrenciye "sevdin mi?" diye sorulmuyor | [ÖNERİ] Kodda kalır, ana akışta gösterilmez |
| B5 | Dene → Seç → Daralt | Var: aşama şeridi | Sınıfa özel modüller Psikoeğitim'in içinde gizli | [ÖNERİ] Tek etiket |
| B6 | Bölüm ve üniversite katmanı | Var: Tercihlerim (14 bölüm, 7 üniversite) | Meslek, maaş ve alan bilgisi var; bölüm ve üniversite yok | [ÖNERİ] Olduğu gibi kalır |
| C1 | Tek ödül dili | Demoda rozet ya da kredi yok | Kredi, rozet ve sertifika ayrı sistemler; rozetler art arda açılır pencerelerde | [ÖNERİ] Yalnızca sunumda |
| C2 | Boş ekran yerine sonraki adım | Büyük ölçüde var (`Empty` bileşeni eylem öneriyor) | Boş sekmeler, eylemsiz yükleme ekranları (test notları) | [ÖNERİ] Kontrol listesi |
| C3 | Sade arayüz ve renk | Mor tema; 429 renk kodu doğrudan yazılmış | Öğrenci tarafı turkuaz `#0D9488`; okul paneli indigo `#4F46E5`; marka lacivert `#14293D` ve bronz `#B08854`; yazı tipi Urbanist (D, ölçüldü) | [KESİN] Kariyer Küre kimliği. Renk varyantı [AÇIK] |
| C4 | Tutarlılık | — | 7 adım ile 8 adım çelişkisi; modül numarası ile sayaç uyumsuz; seviye kilitleri çelişkili (test notları) | [ÖNERİ] Terim ve durum tutarlılığı |
| D | #3 kariyer günleri, #10 deneme sınavı, #11 ekip eşleştirme, #13 günlük | #10 var (Ege senaryosu), #11 kısmen var (ekip talebi) | — | [ÖNERİ] Sonraya bırak ya da birleştir; #13 elendi |

**Eksik bilgi:** 15 fikrin hepsinin içeriği mevcut. Eksik olan tek şey, ayrı bir **rehber öğretmen hesabı** görünümü. Okul paneli, öğrenci ayrıntılarının orada göründüğünü söylüyor, ama o görünümü incelemedik.

### 2.2 Yeni bileşenler (24 Eki, Eymen)

| ID | Bileşen | Kaynak |
|---|---|---|
| Y1 | PDR koordinasyonunda katmanlı mentorluk (PDR, danışman öğretmen, öğrenci) | Eymen'in görev metni, Bölüm 3 |
| Y2 | Fırsat modülünün genişletilmesi: burs, staj, yaz okulu, mentorluk, uluslararası fırsatlar; başvuru takibi | Görev metni, Bölüm 4 |
| Y3 | 11–12. sınıflar için uluslararası sınav planlaması (SAT, ACT, TOEFL) | Görev metni, Bölüm 5 |
| Y4 | Kullanılabilirlik bulgularından çıkan ilkeler (ilk fayda, ilerleme tutarlılığı, teslim akışı, kilitler, metin ağırlığı, rozetler, mülakat) | Takım test notları, 24 Eki |

---

## 3. Çıktı 2: Yeni bileşenlerin sistemdeki yeri

### Y1: Katmanlı mentorluk → **B2'nin genişlemesi, yeni bir modül değil** [ÖNERİ]

- **Kurumsal dayanak (D):** MEB Rehberlik ve Psikolojik Danışma Hizmetleri Yönetmeliği (yayımlanması 14 Ağustos 2020) okullarda bir rehberlik servisi öngörüyor. Hizmetlerin koordinasyonu bu servise ait; **sınıf rehber öğretmenliği** de var olan bir görev. Rehber öğretmen, risk altındaki öğrencileri sınıf rehber öğretmenlerinden gelen verilerle belirliyor (Eurydice). Yani önerdiğimiz ikinci katman zaten okullarda bulunuyor. **Yeni bir rol icat etmiyoruz; var olan sınıf rehber öğretmenliğini dijital olarak destekliyoruz.** Uygulanabilirlik ve PDR jürisi açısından bu en güçlü argümanımız.
- **Eşleşme:**
  - PDR uzmanı = okul rehber öğretmeni.
  - Danışman öğretmen = sınıf rehber öğretmeni.
  - Öğrencinin kendi seçtiği bir mentor ancak gelecek düzeyinde ele alınır (H). Kapasite, çıkar çatışması ve okul prosedürü pilotta belirlenmeli.
- **Kesin sınırlar** [ÖNERİ, Bölüm 8'deki güvenlik ilkeleriyle birlikte]:
  - Platform sessiz ya da içine kapanık öğrenciyi **otomatik olarak sınıflandırmaz ve teşhis koymaz.**
  - Sinyaller yalnızca şunlardan oluşur:
    - Öğrencinin kendi isteğiyle gönderdiği talepler (görüşme, ekip, "yardım istiyorum").
    - Öğrencinin paylaşmayı onayladığı hedef ve ilerleme özeti.
    - Öğretmenin kendi kaydettiği kısa ve somut gözlem (yalnızca PDR'nin görebileceği bir alanda).
  - Psikolojik içerik, kişilik çıkarımı ve davranış skoru **toplanmaz.**
- **Kapsayıcı yaklaşım:** "Sessiz öğrenciyi bulmak" yerine **her öğrenciye aynı, düşük eşikli kanallar** sunulur. Fırsat kartında tek dokunuşla "Öğretmenimle konuşmak istiyorum" seçeneği bulunur. Rotada adım tamamlanınca öğrenciye "takıldığın bir yer var mı?" diye isteğe bağlı bir soru gelir. Böylece kimse ayrıştırılmaz ve talep öğrenciden gelir.
- **Rol ve yetki matrisi** [ÖNERİ]:

| Bilgi | Öğrenci | Sınıf rehber öğretmeni | PDR (rehber öğretmen) | Okul yöneticisi |
|---|---|---|---|---|
| Kendi hedefleri, rotası, notları | Tam | Yalnızca **paylaşmayı onayladığı özet** | Onaylı özet | Yok |
| Talepler (görüşme, ekip) | Gönderir ve görür | Kendi sınıfının talepleri | Tümü (yönlendirilenler) | Yalnızca sayısal |
| Öğretmen gözlemi | Yok | Yazar | Okur | Yok |
| Sınıf fırsat özeti (sayılar ve yaklaşan tarihler) | — | Kendi sınıfı | Okul geneli | Okul geneli (anonim) |
| Ölçek sonuçları | Kendi | Yok (bugünkü Kariyer Küre kuralına bağlı) | Var | Tamamlanma durumu |

- **Prototipte (MVP):** Mevcut `TeacherPage` (PDR görünümü) kullanılır ve "Sınıfın fırsat özeti" kartı eklenir (Simüle: örnek sınıf verisi). Ekip ve görüşme talebi akışı zaten **çalışıyor.** Katmanlar (sınıf rehber öğretmeni ve PDR ayrımı) **gelecek** düzeyinde; sunumda yetki matrisiyle anlatılır.
- **Ölçüm (H):**
  - Öğrenci talebinin cevaplanma süresi.
  - Öğretmen başına haftalık ek süre (iş yükü).
  - Talep gönderen öğrenci oranı (sınıf geneline göre).
  - İtiraz ve düzeltme sayısı.
- **İtiraz ve düzeltme:** Öğrenci paylaşımını her an geri çekebilir. Yanlış bir yönlendirmeyi "bu bana uygun değil" ile kapatabilir. Yönlendirmeyi her zaman bir insan yapar; sistem yalnızca öneri ve hatırlatma üretir.
- **Açık araştırma:** Öğretmen başına makul öğrenci sayısı için kanıt bulunamadı → **pilotta belirlenecek (H).** Rehber öğretmen normu (150 ve 500 öğrenci eşikleri) 19 Ekim'deki araştırmada görüldü, bugün yeniden doğrulanmadı (G). Sunumdan önce MEB Norm Kadro Yönetmeliği'nden kontrol edilecek.

### Y2: Fırsat modülünün genişletilmesi → **A1 ve A3'ün veri kapsamı** [ÖNERİ]

- Yeni bir modül değil, `Opportunity.kind` listesinin genişletilmesi. Bugünkü türler: deneyim, kulüp, proje, yarışma, araştırma, sınav. **Burs, yaz okulu ve mentorluk** türleri eklenebilir. Staj zaten Kariyer Küre'de "Staj İlanları" olarak var; entegrasyonda o modüle bağlanır.
- **Başvuru takibi zaten kısmen var:** `Track.participation` = araştırıyorum, hazırlanıyorum, başvurdum, katıldım. "Başvurdum" öğrencinin kendi beyanıdır, otomatik gönderim yapılmaz (README, D). Durum modeli Bölüm 4'te (FR-3).
- **Veri toplama:** [KESİN] hibrit model, sunumda anlatılır. Kurallar:
  - Yalnızca resmî kaynak.
  - Bilinmeyen alan **boş ve "doğrulanmadı"** olarak gösterilir, uydurulmaz.
  - Her kayıtta son doğrulama tarihi bulunur (mevcut alan `verifiedAt`).
- **Prototipte:** Mevcut 10 gerçek yarışma + en fazla 2 yeni tür (örneğin bir yaz okulu ve bir burs). **Ancak resmî kaynaktan doğrulanabilirse eklenir, aksi hâlde "Örnek" etiketi taşır.**

### Y3: Uluslararası sınav planlaması → **A1/A3 içinde "sınav" türü fırsat ve hedefe bağlı kontrol listesi** [ÖNERİ]

- Demoda 11–12. sınıflar için `sinav` türü ve Ege senaryosu zaten var (YKS kaynakları).
- **Amaçlar (G, ayrıntılar resmî kaynaktan doğrulanacak):**
  - **SAT ve ACT:** Ağırlıklı olarak ABD lisans başvurularında kullanılan standart sınavlar. Pek çok üniversite sınav puanını isteğe bağlı tutuyor; bazıları yeniden zorunlu hâle getirdi. Okul ve programa göre kontrol edilmeli.
  - **TOEFL:** Anadili İngilizce olmayan adayların İngilizce yeterliğini ölçer. SAT ve ACT'nin **yerine geçmez.** IELTS gibi alternatifler programa göre kabul edilebilir.
- **Tasarım:** Sınav bilgisi genel bir sayfa olarak değil, **öğrencinin seçtiği hedefe bağlı bir kontrol listesi** olarak sunulur: "Hedefin: ABD'de bilgisayar mühendisliği → hedef okulların sınav şartını kontrol et." Kesin tavsiye verilmez; resmî bağlantı ve son doğrulama tarihi gösterilir.
- **Kapsam önerisi:** **Gelecek düzeyi.** Gerekçeler:
  1. Yönergenin tek sorun kuralı.
  2. Tarih ve ücretlerin bugün doğrulanması zaman alır.
  3. Demodaki 10. sınıf persona bu özelliği görmez.

  Sunumda yol haritasının "11–12. sınıf" adımı olarak anılır.

### Y4: Kullanılabilirlik ilkeleri → **C2, C4, A4 ve A5 için ürün gereksinimleri** [ÖNERİ]

| Test notu | Ürünümüze dönüşen ilke | Yalnızca Kariyer Küre'ye ait kalan |
|---|---|---|
| 6.1 İlk faydaya ulaşmak çok uzun | FR-1 ilk oturum değeri | Ölçeklerin uzunluğu (ölçek maddeleri değiştirilmez) |
| 6.2 İlerleme tutarsız | FR-2 tek kaynaktan ilerleme | Sunucu ve ağ kök nedeni (doğrulanmadı, B) |
| 6.3 Teslim çıkmaza giriyor | FR-3 durum makinesi | "Gelecekteki Ben" teslim hatası |
| 6.4 Kilitler çelişiyor | FR-4 kilit yok; varsa tek kural ve açıklama | Seviye hesabı |
| 6.5 Metin ve form ağırlığı | İçerik ilkesi: amaç, yapılacak iş, çıktı ve bitiş ölçütü kartta görünür | Modül metinleri |
| 6.6 Rozet pencereleri | C1: tek ve kısa başarı özeti, ardından sonraki adım | Rozet sistemi |
| 6.7 Mülakat geri bildirimi tekdüze | Kapsam dışı (mülakat modülü geliştirmiyoruz) | Mülakat modeli |
| KDE yazım ve dil sorunları | Kapsam dışı; "platforma not" listesine | Ölçek metinleri |

---

## 4. Çıktı 3: İlk ürün gereksinimleri (MVP)

Her gereksinimin kabul ölçütü prototipte test edilecek. "Demoda" sütunu kod incelemesine dayanır (D).

| ID | Gereksinim | Demoda | Yapılacak | Kabul ölçütü |
|---|---|---|---|---|
| **FR-1** İlk oturum değeri | Öğrenci en fazla 6 soru ve yaklaşık 2 dakika içinde kendine uygun en az 3 fırsatı, her birinin gerekçesiyle görür. Hesap açmak ya da ölçek doldurmak ön koşul değildir | Büyük ölçüde var | Şehir sorusu; A2 gerekçeleri | Yeni profilden ilk 3 kartın görünmesi ≤ 6 adım; her kartın gerekçesi farklı; boş sonuçta "Filtreleri temizle" çıkar |
| **FR-2** Tek kaynaktan ilerleme | Bütün sayaçlar ve durumlar tek bir durum nesnesinden **hesaplanır**; ayrıca bir sayaç saklanmaz. Kayıt okunamazsa "veri yok" ile "tamamlanmadı" birbirinden ayrılır | Var: `State` tek kaynak, `validState` / `loadState` uyarısı | Rotam ve takvimde aynı işin aynı durumda göründüğünü test etmek | Bir işi takvimde tamamlamak Rotam'da da tamamlanmış gösterir (test var). Bozuk kayıtta uygulama açılır ve açıklayıcı uyarı verir (test var) |
| **FR-3** Durum makinesi | Fırsat yaşam döngüsü: **Kaydedildi → Rotada / hazırlanıyor → Başvurdum (beyan) → Katıldım → Değerlendirildi.** "Kaydet", "Rotaya ekle", "Tamamla" ve "Değerlendir" eylemleri ayrı ve adlandırılmış. Her geçişten sonra kullanıcı bir **sonraki adım** ekranına gider, boş ekrana düşmez | Kısmen: `participation` ve `reflection` var | Durum adlarını tutarlı hâle getirmek; geçiş sonrası yönlendirmeyi kontrol etmek | Her geçişte doğru ekran ve doğru durum; "Başvurdum" kartta beyan olarak etiketli |
| **FR-4** Kilit yok | Prototipte hiçbir özellik "önce X'i tamamla" ile kilitlenmez. Gelecekte kilit olursa eksik şart ve nasıl tamamlanacağı tek bir kurala bağlı olarak gösterilir | Kilit yok (D) | — | Uygulamadaki hiçbir ekranda çelişkili seviye uyarısı yok |
| **FR-5** Uygunluk dürüstlüğü (A2) | Uymayan fırsat uygunmuş gibi gösterilmez; bilinmeyen ücret "ücretsiz" sayılmaz; son tarihi geçen önerilmez; belirsiz koşul "kontrol et" olarak gösterilir | Büyük ölçüde var (test var) | A2 1–3. fazlar | A2 test senaryoları (Ek A) |
| **FR-6** Hatırlatma (A3) | Takvime eklenen fırsatın son tarihi yaklaşınca öğrenciye bildirim gösterilir | Takvim var, bildirim yok | Rotam açılışında simüle bildirim | "Kayda N gün kaldı" doğru tarihten hesaplanıyor (sunum günü 24 Eki'ye sabit) |
| **FR-7** Mentor yetkisi (Y1 / B2) | Öğretmen yalnızca öğrencinin **onayladığı** özeti ve talepleri görür; öğrenci paylaşımı geri çekebilir; sistem teşhis ya da skor üretmez | Var: onay sonrası paylaşım (`TeacherPage`) | "Sınıfın fırsat özeti" kartı (simüle) | Onaylanmamış not öğretmen görünümünde yok; özet yalnızca sayı ve tarih içeriyor |
| **FR-8** Kaynak dürüstlüğü | Her fırsatta "Resmî kaynaklı" ya da "Örnek" etiketi, kaynak bağlantısı ve son doğrulama tarihi var | Var | Görünürlüğü artırmak | Bütün kartlarda etiket var |
| **FR-9** Kimlik (C3) | Tek palet; Urbanist; renkler değişkenlerde | Mor, sabit renk kodları | Palet değişimi | Ekranlarda mor kalmadı; kontrast WCAG AA |

---

## 5. Çıktı 4: Araştırma ve doğrulama görevleri

| # | İddia veya soru | Bağlı karar | Durum | Yöntem | Ne zaman |
|---|---|---|---|---|---|
| R1 | Sınıf rehber öğretmenliği ve rehberlik servisi koordinasyonu var | Y1 uygulanabilirliği | **(D)** MEB 14.08.2020 haberi; Eurydice | Tamam | — |
| R2 | Rehber öğretmen normu (150 ve 500 eşikleri) | Sorun slaytı | (G), yeniden kontrol | MEB Norm Kadro Yönetmeliği | Sunumdan önce, 5 dk |
| R3 | Kariyer Küre'nin mevcut özellikleri (Fırsatlar boş, takvim yalnızca görüşmeler, Erken Uyarı, Atölye & Etkinlik) | Özgünlük, entegrasyon | **(D)** kendi gözlemimiz, 23–24 Eki | Ekran görüntüleri (gizlilik notuna uyarak) | Kodlama sırasında |
| R4 | 10 gerçek yarışmanın tarihleri | FR-8, demo | **(D)** arkadaşımızın 22 Eki kontrolü, `SOURCES.md` | Demoda kullanılacak 2–3'ü tekrar kontrol | 13:15 sonrası |
| R5 | SAT, ACT, TOEFL amaç ve şartları | Y3 | (G) genel; ayrıntı (B) | Resmî siteler | **Gelecek düzeyi**; sunumda yalnızca amaç |
| R6 | Çocuk verisi, KVKK ve okul izin süreçleri | Y1, FR-7 | (B) hukuki güvence iddiası **yok** | KVKK ve MEB kaynakları | Sunumda "ilke" düzeyinde; hukuki uygunluk iddia edilmez |
| R7 | Rakip özellikleri (TAL Akademi, PiriTeknoloji, MEB Kariyer Yolculuğu iddiası) | Özgünlük | (B) doğrulanmadı | Kamuya açık kaynaklar | **[ÖNERİ]** Yapılmasın. Özgünlüğü Kariyer Küre'deki doğrudan gözlemimize dayandırırız |
| R8 | Jüri profilleri | Sunum tonu | (B) | Resmî sayfalar | İsteğe bağlı; kişiye özel iddia kullanılmaz |
| R9 | "İlk oturum değeri ve hatırlatma geri dönüşü artırır" | Fayda ve ölçüm | **(H)** | Pilot: iki haftalık sınıf denemesi (metrikler Bölüm 7) | Sunumda hipotez olarak |
| R10 | Okul panelindeki erken uyarı listesinde başka okulların öğrencilerinin görünmesi | Etik | (D) gözlem, kök neden bilinmiyor | Düzenleyiciye özel bildirim | **Sunumda kullanılmaz** |

**Prototip gerektirenler (P):**
- FR-1 (ilk oturumda geçen süre)
- FR-3 (durum geçişleri)
- FR-6 (hatırlatma)
- FR-7 (onaylı paylaşım)

---

## 6. Karar ve kalite kontrolü

**Bir fikir şu durumda kesinleşir:**
1. Problem, kullanıcı, mekanizma, gerçeklik düzeyi ve kabul ölçütü yazılmış olmalı.
2. Kritik bir (B) kalmamış ya da "gelecek" düzeyine alınmış olmalı.
3. Eymen onaylamış olmalı.

**Fikir değerlendirme ölçütleri** (yönergeden): sorun tanımına katkı · ihtiyaca uygunluk · özgünlük (gözleme dayalı) · uygulanabilirlik · Kariyer Küre'ye entegrasyon · etki · demoda gösterilebilirlik · **tek sorun kuralına uyum.**

**Entegrasyon kontrolü:**
- Her fikir kullanıcı yolculuğunda bir yere oturmalı (Bölüm 7).
- İki fikir aynı işi yapmamalı.
- Animasyonda ve sunumda gösterilen her şey prototipte olmalı ya da "gelecek" olarak etiketlenmeli.
- Demo senaryosu tek bir akışta kesintisiz çalışmalı.

**Aşama ancak çıktısı hazır olunca kapanır.** Süre biterse neyin kesileceğine Eymen karar verir.

---

## 7. Ürün tanımı ve kullanıcı yolculuğu [ÖNERİ, onay bekliyor]

**Sorun cümlesi** (yönergedeki kalıba göre):
> Lise öğrencileri, ilgi alanlarına uygun yarışma ve gelişim fırsatlarını ararken, dağınık ve güncelliği belirsiz bilgiler arasında hangisinin kendilerine uygun ve hâlâ açık olduğunu bilemiyor. Bu durum fırsatların ve son tarihlerin kaçırılmasına, Kariyer Küre'deki keşif sonuçlarının somut bir adıma dönüşmemesine ve öğrencinin uygulamaya geri dönmemesine yol açıyor. **Rehber öğretmen de öğrencinin ne yapmadığını görüyor, ama neyin peşinde olduğunu göremiyor.**

**Çözüm:** Kariyer Küre Rota. Kariyer Küre'nin keşif sonuçlarını **uygun ve açık gerçek fırsatlara**, bu fırsatları **takvimli küçük hazırlık adımlarına**, ilerlemeyi de **öğrencinin onayıyla rehber öğretmenin görebileceği somut bir sinyale** dönüştüren katman.

**Gelişim döngüsü** (Eymen'in döngüsünün 15 fikre eşlenmiş hâli):

| Aşama | Fikirler | Not |
|---|---|---|
| Kendini tanıma | Kariyer Küre envanterleri (mevcut) + B3 | Ölçekler değiştirilmez; B3 ilk fayda için kısa bir giriş kapısıdır |
| Keşif | A1, A2, B5 | |
| Bilinçli karar | B6, A2 | |
| Gerçek fırsata erişim | A1, A2, Y2, B1, (Y3 gelecek) | |
| Deneyim ve uygulama | A4, A3, A5 | "Projeyi gerçekleştirme sistemi" hipotezi = A4 |
| Geri bildirim | B4, B2 / Y1 | "Deneyimden öğrenen yönlendirme" hipotezi = B4 |
| Gelişim ve yeni hedef | B4 → A1 (öneriler değişir, nedeni gösterilir) | Döngü kapanır |
| **Eksik görülen** | **Destek isteme ve insan teması** | Y1 ile kapanır: düşük eşikli talep kanalı |

**Animasyonla uyum:**
- "Hangisi bana uygun?" → A1, A2
- "Başvurusu hâlâ açık mı?" → A3, A4, A5
- "Takımı nereden bulacağım?" → B2, Y1 (ekip talebi)

**Demo senaryosu** (10. sınıf, İstanbul, robotik ve elektronik ilgisi):
6 soru → "Sana göre" listesi ve "Neden sana?" → Technovation detayı → rotaya ve takvime ekle → hazırlık adımları → Rotam'da "kayda N gün kaldı" bildirimi → "Öğretmenimle paylaş" ve ekip talebi → PDR görünümünde talep, sınıf özeti ve yanıt → öğrenci yanıtı görür.

**Ölçüm (6. sunum başlığı, hepsi H, pilotta ölçülecek):**
- İlk fırsatın kaydedilmesine kadar geçen süre
- Fırsat takip eden öğrencilerin 7 ve 14 günlük geri dönüş oranı (Kariyer Küre'nin mevcut Giriş Takibi'ne eklenir)
- Kaçırılan son tarih oranı
- Hazırlık adımı tamamlama oranı
- Öğretmen talebine yanıt süresi
- Öğretmen başına ek süre

---

## 8. Güvenlik, gizlilik ve sorumlu yapay zekâ ilkeleri [ÖNERİ]

1. **Veri minimizasyonu:** Psikolojik durum, kişilik çıkarımı ve davranış skoru toplanmaz.
2. **Öğrenci onayı:** Öğretmene giden her bilgi öğrencinin açık onayıyla gider ve geri çekilebilir (demoda mevcut).
3. **Rol tabanlı erişim:** Bölüm 3'teki matris. Prototipte rol geçişi yalnızca bir demo kontrolüdür, gerçek yetkilendirme değildir (README, D).
4. **Yapay zekânın rolü:** Uygunluk ve tarih kararı **kurallarla** verilir. Yapay zekâ ileride yalnızca katalogdaki kayıtlar arasından açıklama ve taslak metin üretir. Prototipte canlı yapay zekâ **yok** (D).
5. **İnsan denetimi:** Yönlendirme kararını her zaman öğretmen verir. Öğrencinin "uygun değil" ile itiraz yolu vardır.
6. **Hukuk:** KVKK ve MEB süreçlerine uygunluk **iddia edilmez**; gerçek üründe ayrıca incelenecektir (R6).
7. **Demo verisi:** Gerçek öğrenci verisi kullanılmaz. Okul panelinde gözlenen başka öğrencilere ait adlar hiçbir materyalde yer almaz (R10).

---

## 9. Mimari

**Prototip mimarisi (D, mevcut):** React 19, TypeScript ve Vite ile istemci tarafında çalışan bir uygulama. Tek bir `State` nesnesi tarayıcıda saklanıyor (`localStorage`, sürümlü ve doğrulamalı). Saf fonksiyonlardan oluşan bir motor (`engine.ts`) var. Veri dosyaları: `catalog.ts`, `competitions.ts`, `targets.ts`. 35 birim testi. Arka uç yok.

**Gerçek ürün mimarisi (Gelecek, yalnızca şema olarak anlatılır)** [ÖNERİ]:
- **Kariyer Küre'nin mevcut kimlik ve okul üyeliği** kullanılır. Öğrenci, okul ve rehber öğretmen rolleri zaten var (D).
- **Yeni hizmetler:**
  - Fırsat Kataloğu (hibrit toplama, editör onayı, doğrulama tarihi)
  - Rota ve Takvim (öğrencinin takipleri, görevler, hatırlatmalar)
  - Paylaşım ve Talep (onay kaydı, geri çekme, rol tabanlı görünüm)
- **Mevcut modüllere bağlantılar:**
  - Atölye & Etkinlik → B1
  - Staj İlanları → Y2
  - Randevu ve müsaitlik → B2 / Y1
  - Giriş Takibi → ölçüm
  - Erken Uyarı → olumlu fırsat sinyali
- **Veri modeli** (ana varlıklar):
  - `Opportunity` (kaynak, tür, alanlar, sınıf aralığı, konum ve kısıt, olay tarihleri listesi, ücret durumu, `verifiedAt`, durum)
  - `Profile`
  - `Track` (durum, görevler, ilerleme notları)
  - `Reflection`
  - `TeacherRequest`
  - `ShareConsent` (yeni: kapsam, tarih, geri çekme)
  - `ClassSummary` (türetilmiş, anonim sayılar)

---

## 10. Çıktı 6: Kodlamaya hazır olma kontrol listesi

- [x] Kod tabanı seçildi ve incelendi; testler geçiyor (35/35) [KESİN]
- [x] A1 ve A2 kesin
- [ ] **Bölüm 7'deki ürün tanımı ve sorun cümlesi onaylandı**
- [ ] **Y1–Y4'ün yeri onaylandı** (Bölüm 3)
- [ ] **FR-1…FR-9 onaylandı** (Bölüm 4)
- [ ] Renk varyantı: (a) her yerde turkuaz + lacivert / (b) öğretmen görünümünde indigo
- [ ] Alt ilgi etiketleri: sonraya mı?
- [ ] A3, A4, A5, B1–B6, C1–C4 ve D önerileri onaylandı (Bölüm 2.1)
- [ ] Kodlama sırası onaylandı (aşağıda)
- [ ] `CLAUDE.md` depoya eklendi

**Önerilen kodlama sırası** (her dilimden sonra test, derleme ve commit):
1. C3 renk ve kimlik
2. A2 1. ve 2. faz
3. A5 Rotam sadeleştirme ve menü
4. A3 simüle hatırlatma
5. B2 / Y1 "Sınıfın fırsat özeti" kartı
6. A1 konum filtresi ve B3 şehir sorusu
7. B1 rozeti
8. Prova

Kod 14:00'te dondurulur. Yetişmeyen dilim sunumda "gelecek" olarak anlatılır.

---

## Ek A: Test senaryoları (A2 ve FR'ler)

1. Demo öğrencisinde ilk 4 kartın gerekçeleri birbirinden farklı.
2. İlgi seçilmemiş öğrencide türe göre gerekçe gösteriliyor, hata yok.
3. Hiç uygun sonuç olmayan profilde boş ekran mesajı ve "Filtreleri temizle" görünüyor.
4. Ücreti bilinmeyen fırsat "ücretsiz" sayılmıyor.
5. Son tarihi geçmiş fırsat önerilmiyor.
6. Cevap değiştirilince liste ve gerekçeler güncelleniyor.
7. Rotaya eklenmiş bir fırsat, profil değişip uygunluğunu kaybedince rotadan silinmiyor.
8. İl kısıtlı fırsat yalnızca o ildeki öğrenciye uygun görünüyor; çevrim içi fırsat herkese açık.
9. Bozuk ya da eski kayıtla uygulama açılıyor.
10. Takvimde tamamlanan iş Rotam'da da tamamlanmış görünüyor.
11. Onaylanmamış not PDR görünümünde yer almıyor.
12. Her durum geçişinden sonra boş ekran değil, bir sonraki adım görünüyor.

## Ek B: Kaynaklar

- MEB, "Rehberlik ve Psikolojik Danışma Hizmetleri Yönetmeliği yayımlandı", 14.08.2020: https://www.meb.gov.tr/rehberlik-ve-psikolojik-danisma-hizmetleri-yonetmeligi-yayimlandi/haber/21433/tr
- Eurydice, "Rehberlik hizmetlerinden sorumlu eğitim personeli": https://eurydice.eacea.ec.europa.eu/tr/eurypedia/turkiye/rehberlik-hizmetlerinden-sorumlu-egitim-personeli
- Yarışma kaynakları: depodaki `SOURCES.md` (22 Eki 2026 kontrolü)
- Kariyer Küre gözlemleri: kariyerkurem.com öğrenci hesabı (23 Eki) ve okul paneli (24 Eki), takım test notları (24 Eki)
- Yapay zekâ desteği: Analiz, planlama, belge ve kod desteğinde Claude (Anthropic) kullanıldı. Sunumda belirtilecek.

## Ek C: Değişiklik günlüğü

- 23 Eki 23:00: Mevcut kod tabanı seçildi; fork; A1 kesin.
- 24 Eki 10:25: A2 kesin.
- 24 Eki 10:50: Geçici ad "Kariyer Küre Rota"; Kariyer Küre kimliği; **iki animasyon yerine tek animasyon**; görev dağılımı yok.
- 24 Eki 12:05: Y1–Y4 eklendi (öneri durumunda); ana belge v0.1.
- 24 Eki 12:13: Eymen geliştirmeye başlanmasını istedi ("gereksiz onay bekleme"). Sunum rehberine göre süre 7+3 dk (Eymen'in metnindeki 15 dk ile çelişiyor; rehber esas alındı).
- 24 Eki 12:30: Prototip dilimleri tamamlandı (Bölüm 11).


---

## 11. Uygulama durumu (prototip, 24 Eki 12:30)

**Commit'ler (fork, yerelde):** `35660f8` renk kimliği · `259ea13` A2 · `ffb4e8b` A3 + mahremiyet + sınıf özeti · `8ce1148` A1 konum · `c944550` A5 Bugün şeridi ve büyük yazı. **Testler: 46/46 · derleme hatasız.**

| Madde | Yapılan | Gerçeklik | Dosyalar |
|---|---|---|---|
| C3 / FR-9 | Mor tonlar Kariyer Küre turkuaz, lacivert ve slate paletine taşındı (betikle, ton bazlı). Ana değişkenler: `#0d9488`, `#0f766e`, `#0f172a`, `#64748b` | Çalışan | `styles.css`, `ui.tsx`, `RoutePage.tsx` |
| Erişilebilirlik | Yazı boyutları büyütüldü (en küçük 11 px; eskiden 6–9 px vardı). "Büyük yazı" düğmesi (%115) bu tarayıcıda hatırlanıyor | Çalışan | `styles.css`, `App.tsx` |
| A2 / FR-5 | Gerekçe sırası (tercih → ilgi + tür → hedef → pratik), türe göre cümleler, listede tekrar önleme (`distinctReasons`), "Neden sana?" etiketi, "Tüm fırsatlar"da "Şu an sana uymuyor: …" | Çalışan | `engine.ts`, `Opportunities.tsx`, `RoutePage.tsx` |
| A1 / FR-5 | `mode`, `city`, `onlyCities` (fırsat) ve `city` (profil); il kısıtı uygunluğu; "Katılım" filtresi; kartta konum etiketi; başlangıçta "Hangi ildesin?"; çevrim içi gerekçesi. Örnek il kısıtlı fırsat: "Bilim merkezinde robotik atölyesi" (Örnek etiketli) | Çalışan (örnek veri) | `model.ts`, `catalog.ts`, `competitions.ts`, `engine.ts`, `Onboarding.tsx`, `Opportunities.tsx` |
| A3 / FR-6 | Rotam açılınca hatırlatma: takip edilen fırsatın son başvurusuna kalan gün ve sıradaki hazırlık işi; "Takvimde gör" | Simüle bildirim (uygulama içi; gerçek üründe telefon bildirimi) | `engine.ts` `upcomingReminder`, `RoutePage.tsx` |
| A5 | "Bugün" şeridi: takip edilen fırsat sayısı, yaklaşan son tarih, öğretmen durumu ve "Öğretmenimle konuşmak istiyorum" | Çalışan | `RoutePage.tsx` |
| Mahremiyet / FR-7 | "Öğretmeninle paylaştıkların" bölümünde neyin paylaşıldığı açıklanıyor; **"Paylaşımı geri çek"** düğmesi | Çalışan | `engine.ts` `withdrawRequest`, `Workspace.tsx` |
| B2 / Y1 | Öğretmen görünümünde **"Sınıfın fırsat özeti"**: takip eden öğrenci sayısı, ekip arayanlar, bekleyen görüşmeler, yaklaşan son tarihler ve takip sayıları. Ad, not ya da ölçek sonucu yok | Simüle (örnek sınıf sayıları) + demo öğrencisinin kayıtları canlı | `engine.ts` `classSummary`, `Workspace.tsx` |

**Yapılmadı (bilerek):** Y3 SAT/ACT/TOEFL (gelecek); B1 rozeti; sınıf rehber öğretmeni ile PDR katman ayrımı (gelecek, yetki matrisiyle anlatılacak); gerçek bildirim ve kimlik doğrulama.

**Demo akışı (çalışan):** Başlangıç (6 soru + il) → Fırsatlar "Sana göre" (Neden sana?) → Tüm fırsatlar + Katılım filtresi (uymayan kartta neden) → Technovation detayı → kaydet ya da rotaya ekle → Rotam (Bugün şeridi + hatırlatma) → Deneyimlerim'de özeti paylaş / geri çek → PDR görünümü (talep + sınıf özeti).
