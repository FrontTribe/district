# Real Estate Page - Design Specification

## 1. Hero Section

**Dizajn:**

- Full-screen hero s background slikom/videom zgrade ili real estate projekta
- Veliki naslov "DISTRICT REAL ESTATE" centriran, fade-in animacija
- Subtitles/opis ispod naslova
- Dark overlay (medium) za čitljivost
- Scroll indicator na dnu
- Gradient overlay prema dolje (kao postojeći hero block)

**Tehnical:**

- Koristiti postojeći Hero block kao osnovu
- Background media (image/video)
- Marcellus font za naslov
- GSAP fade-in animacije
- Responsive: mobile padding, manji font

---

## 2. O Nama Section (About Us)

**Dizajn:**

- 2 kolone layout (grid)
- Lijeva kolona: Veliki naslov "O NAMA" (podijeljen u linije)
- Desna kolona: Tekstualni opis + opcionalno slika
- Eyebrow tekst "KONTAKT" gore lijevo (optional)
- Padding: 120px vertical
- Background: #051e24

**Tehnical:**

- Slično BotiqueIntro block ali bez slike ako nije potrebno
- GSAP scroll animations
- Text se prikazuje liniju po liniju

---

## 3. Dosadašnji Projekti Section (Past Projects)

**Dizajn:**

- Heading centriran: "DOSADAŠNJI PROJEKTI"
- Grid layout: 2-3 kolone desktop, 1 kolona mobile
- Svaki projekt kartica s:
  - Slika projekta
  - Naziv projekta
  - Kratak opis (opcionalno)
- Hover efekti: scale slike, overlay, title animation
- Infinite scroll/marquee za mobile (ako ima puno projekata)

**Tehnical:**

- Slično Rooms block ili ImageGrid
- Card-based layout
- GSAP animations na hover i scroll

---

## 4. Aktualne Ponude Stanova Section (Current Offers)

**Dizajn:**

- Heading: "AKTUALNO" ili "PONUDA"
- Grid/Masonry layout za kartice stanova
- Svaki stan kartica s:
  - Slika stana
  - Naziv/Tip stana (npr. "Stan 2.5+1")
  - Kvadratura
  - Cijena (opcionalno)
  - Badge: "SLOBODNO" (zelena) ili "REZERVIRANO" (žuta) ili "PRODANO" (siva)
- Hover: scale, overlay, show details
- Scroll animation: fade in cards

**Tehnical:**

- Card grid layout
- Status badges s bojama
- Filter opcija (samo slobodni, svi) - optional
- Link na detalje stana

---

## 5. Interaktivna Slika Zgrade Section (Interactive Building)

**Dizajn:**

- Full-width slika zgrade (floor plan ili vizualizacija)
- Clickable oblasti za svaki stan (HTML map areas ili SVG overlay)
- Klik na stan → popup/modal s:
  - Slika stana
  - Tlocrt (floor plan)
  - Status (SLOBODNO/PRODANO/REZERVIRANO)
  - Detalji (kvadratura, sobe, cijena)
  - Gumb "REZERVIRAJ TERMIN SASTANKA" → otvara formu
  - Gumb "ZATVORI"

**Tehnical:**

- SVG overlay ili imagemap
- React modal/popup komponenta
- Form handling za rezervaciju
- State management za selektirani stan
- GSAP animations za popup

---

## 6. Tražiš Posao Section (Job Opportunity)

**Dizajn:**

- Background slika (opcionalno)
- Badge: "KARIJERA" ili "ZAPOŠLJAVANJE"
- Naslov: "TRAŽIŠ POSAO?"
- Subtitle: "KOD NAS KAO IZVOĐAČ?"
- Opis: tekstualni opis pozicije
- Contact email field ili button: "KONTAKT NA MAIL"
- Feature list (opcionalno): što nudimo
- CTA button s email linkom

**Tehnical:**

- Koristiti JobOpportunity block kao osnovu
- Email link: mailto:
- Background image optional
- GSAP scroll animations

---

## 7. Tehnički Opis i Specifikacija Stanova Section

**Dizajn:**

- Heading: "TEHNIČKI OPIS I SPECIFIKACIJA STANOVA"
- 2 kolone layout:
  - Lijeva: Opis (tekst, lista)
  - Desna: Specifikacija (tabela ili lista)
- Icons ili bullet points za feature list
- Background: #051e24
- Padding: 120px vertical

**Tehnical:**

- Text block s rich content
- Optional tabela za specifikacije
- Responsive: stack na mobile

---

## 8. Kontakt Section

**Dizajn:**

- Grid layout: 2 kolone
  - Lijeva: Kontakt info
    - Heading "KONTAKT"
    - Adresa
    - Email
    - Telefon
    - Social media links (Instagram, Facebook) - checkbox stil
  - Desna: Kontakt forma
    - Ime
    - Email
    - Poruka
    - Submit button
- Background: #051e24
- Padding: 120px vertical

**Tehnical:**

- Koristiti BoutiqueContact block kao osnovu
- Social links s ikonama ili teksta
- Form submission handling
- GSAP animations

---

## Global Styling Notes:

- Background: #051e24 (dark green)
- Font: Marcellus (serif)
- Text color: #ffffff
- Accent colors:
  - Available: #8cff9a (green)
  - Reserved: #ffb869 (yellow/orange)
  - Sold: rgba(255,255,255,0.3) (gray)
- Spacing: Consistent padding 120px vertical desktop, 60px mobile
- Animations: GSAP ScrollTrigger fade-in, scale, slide
- Responsive: Mobile-first, stack kolone na mobile
