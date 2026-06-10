# Gezi Harcama — Kurulum

## 1. Supabase veritabanını kur (tek seferlik, ~5 dakika)

1. https://supabase.com adresine git → **Start your project** → GitHub hesabınla giriş yap.
2. **New project** de:
   - Name: `gezi-harcama`
   - Database password: güçlü bir şifre üret (bir yere not etmene gerek yok, uygulama kullanmıyor)
   - Region: **Southeast Asia (Singapore)** (Endonezya'ya en yakını)
3. Proje açılınca sol menüden **SQL Editor** → **New query** → aşağıdaki SQL'i yapıştır → **Run**:

```sql
create table expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  name text not null,
  amount numeric not null,
  created_at timestamptz default now()
);

alter table expenses enable row level security;

create policy "herkes okur yazar" on expenses
  for all using (true) with check (true);
```

4. Sol menüden **Project Settings → API** bölümüne git ve şu iki değeri kopyala:
   - **Project URL** (örn. `https://abcdefgh.supabase.co`)
   - **anon / public** anahtarı (`eyJ...` ile başlayan uzun metin)

## 2. Uygulamayı telefonlara kur

1. iPhone'da Safari ile aç: **https://n2es.github.io/gezi-harcama/**
2. Açılan **Kurulum** ekranına 1. adımda kopyaladığın URL ve anon anahtarını yapıştır → **Bağlan**.
3. Safari'de **Paylaş** düğmesi → **Ana Ekrana Ekle**. Artık normal bir uygulama gibi açılır.
4. Aynı iki adımı eşinin telefonunda da yap. İkiniz de aynı veritabanına yazarsınız.

## Notlar

- Tutarlar **IDR** girilir; uygulama güncel kurla **USD** karşılığını da gösterir. Kur günde bir kez internetten çekilir, çevrimdışıyken son bilinen kur kullanılır.
- İnternet yokken kaydedilen harcamalar telefonda bekletilir, bağlantı gelince otomatik gönderilir.
- Bir kaydı silmek için Harcama Kontrol ekranında satırın yanındaki ✕ işaretine dokun.
