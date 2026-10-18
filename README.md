# GeoLingo

Қазақша Duolingo-стиль веб-қосымша: географиялық нысандарды картадан тауып жатта.

## Іске қосу

```bash
npm install
npm run dev
```

Браузерде [http://localhost:3000](http://localhost:3000) ашылады.

## Демо режим

`NEXT_PUBLIC_SUPABASE_URL` және `NEXT_PUBLIC_SUPABASE_ANON_KEY` бос болса, қосымша толық ойнайды:

- `/login` және `/signup` кез келген пошта мен құпия сөзді қабылдайды
- XP, серия, аяқталған сабақтар және көшбасшылар тізімі `localStorage` ішінде (`geoduolingo.v1`)
- Жетіспейтін env қосымшаны құлатпайды

Үлгі: `.env.example`.

## Supabase

1. Жобада SQL Editor арқылы `supabase/schema.sql` файлын орында.
2. Authentication → Providers → Email ішінде «Confirm email» өшірулі болса, тіркелу бірден сессия ашады. Растау қосулы болса, қосымша сілтемені күтуді сұрайды.
3. `.env.local` файлына жаз:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

4. `npm run dev` серверін қайта іске қос.

Кілттер бар кезде логин, профиль, сабақ прогресі және көшбасшылар Supabase-ке жазылады. Көшбасшылар тізімінде нақты ойыншылармен бірге бірнеше үлгі қарсылас та тұрады. Кестелерде RLS қосулы: әркім өз прогресін ғана өзгертеді, профильдерді оқу көшбасшылар тақтасы үшін ашық.
