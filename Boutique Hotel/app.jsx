/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo, Fragment } = React;

// ===========================================================
// Tweaks defaults
// ===========================================================
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "cream",
  "displayFont": "Fraunces",
  "accent": "#8B3A3A",
  "showBookingStrip": true,
  "heroVariant": "dusk"
}/*EDITMODE-END*/;

const PALETTES = {
  cream:  { bg: "#F4EFE7", bg2: "#EDE6DA", bg3: "#E4DBCB", ink: "#1A1714", inkSoft: "#3A332C", inkMute: "#6B6258" },
  bone:   { bg: "#EFEAE0", bg2: "#E6E0D2", bg3: "#DCD3C1", ink: "#221C18", inkSoft: "#3F362F", inkMute: "#6E6459" },
  alabaster: { bg: "#F7F4EE", bg2: "#EFEBE2", bg3: "#E5DFD2", ink: "#16140F", inkSoft: "#332E26", inkMute: "#6A6256" },
  pearl:  { bg: "#F2F0EC", bg2: "#E9E6E0", bg3: "#DDD9D0", ink: "#181613", inkSoft: "#363229", inkMute: "#6C645A" },
};

const DISPLAY_FONTS = ["Cormorant Garamond", "Playfair Display", "EB Garamond", "DM Serif Display", "Fraunces"];

// ===========================================================
// Real assets from district.hr
// ===========================================================
const CDN = "https://boutique.district.hr/api/media/file/";
const IMG = {
  hero: CDN + "_DSC8896.jpg",
  about1: CDN + "_DSC8812.jpg",
  about2: CDN + "_DSC8546-1024x683.jpg",
  about3: CDN + "_DSC8855.jpg",
  rooftopHero: CDN + "_DSC8530%20(1)%202-1920x1280.jpg",
  contactHero: CDN + "_DSC8863%20(1)%20(1)-1920x1280.jpg",
  rooftop: [
    CDN + "_DSC9307-480x320.jpg",
    CDN + "_DSC9318-480x320.jpg",
    CDN + "_DSC9340-480x320.jpg",
    CDN + "DJI_20241207142535_0167_D-480x270.jpg",
  ],
};

const ROOMS = [
  {
    num: "01", id: "premium", name: "Premium Room", sqm: "26 m²", price: 120,
    summary: "Elegantna klimatizirana soba s ekstra king-size krevetom i pogledom na grad uz Dravu.",
    desc: "Elegantna klimatizirana dvokrevetna soba veličine 26 m² s ekstra king-size krevetom pruža neodoljiv pogled na grad na Dravi. Veliki prozori omogućuju pogled na osječku svakodnevicu, dok je soba dizajnirana s modernim i luksuznim elementima. Prostrana kupaonica s tušem bez praga pruža dodatnu udobnost i funkcionalnost.",
    meta: ["Ekstra king", "Pogled na grad", "Tuš bez praga"],
    images: [
      CDN + "_DSC8926-1024x683.jpg",
      CDN + "_DSC8933-1024x683.jpg",
      CDN + "_DSC8981-1024x683.jpg",
      CDN + "_DSC9000-1024x682.jpg",
      CDN + "_DSC9003-1024x683.jpg",
      CDN + "_DSC9019-1024x682.jpg",
    ],
  },
  {
    num: "02", id: "deluxe", name: "Deluxe", sqm: "30 m²", price: 150,
    summary: "Prostranija inačica s 30 m², luksuznom kupaonicom i pogledom na grad Osijek.",
    desc: "Moderna dvokrevetna soba površine 30 m² s ekstra king-size krevetom garantira prostranost i udobnost. Luksuzna kupaonica s tušem bez praga dodaje dašak elegancije i praktičnosti, stvarajući savršen ambijent za opuštanje. Cjelokupni prostor odiše modernim dizajnom i udobnošću.",
    meta: ["Ekstra king", "30 m²", "Luksuzna kupaonica"],
    images: [
      CDN + "_DSC8535-1024x682.jpg",
      CDN + "_DSC8546-1024x683.jpg",
      CDN + "_DSC8573-1024x683.jpg",
      CDN + "_DSC8956-1024x683.jpg",
      CDN + "_DSC8963-1024x683.jpg",
      CDN + "_DSC8969-1024x683.jpg",
    ],
  },
  {
    num: "03", id: "suite", name: "Suite", sqm: "37 m²", price: 210,
    summary: "Luksuzna 37 m² suite s prostorom za sjedenje i panoramskim pogledom na Osijek.",
    desc: "Luksuzna dvokrevetna soba u Osijeku nudi nevjerojatan panoramski pogled na grad. Klimatizirana, prostire se na 37 m² i nudi ugodan prostor za sjedenje i kvalitetan odmor. Središnji element je ekstra king-size krevet koji osigurava maksimalnu udobnost. Moderna kupaonica s tušem bez praga pruža dodatnu funkcionalnost.",
    meta: ["Ekstra king", "Lounge zona", "Panoramski pogled"],
    images: [
      CDN + "_DSC8819-1024x683.jpg",
      CDN + "_DSC8827-1024x683.jpg",
      CDN + "_DSC8863-1024x683.jpg",
      CDN + "_DSC8869-1024x683.jpg",
      CDN + "_DSC8871-1024x683.jpg",
      CDN + "_DSC8891-1024x683.jpg",
    ],
  },
  {
    num: "04", id: "jacuzzi", name: "Jacuzzi Superior", sqm: "37 m²", price: 290,
    summary: "Privatni jacuzzi u sobi, ekstra king krevet, pogled s visoke pozicije.",
    desc: "Prekrasan pogled na Osijek s visoke pozicije, iz udobne 37 m² sobe. Luksuzno uređena s ekstra king-size krevetom, prostorom za odmor i privatnim jacuzzijem koji pruža potpunu relaksaciju. Prozori omogućuju nevjerojatan pogled, dok stilski uređena kupaonica s kadom dodatno naglašava osjećaj luksuza. Osvjetljenje je nježno, a prostor savršeno dizajniran za miran ugođaj.",
    meta: ["Privatni jacuzzi", "Kada u kupaonici", "Visoka pozicija"],
    images: [
      CDN + "_DSC8636-1024x683.jpg",
      CDN + "_DSC8640%20(1)-1024x683.jpg",
      CDN + "_DSC8654-1024x683.jpg",
      CDN + "_DSC8656-1024x683.jpg",
      CDN + "_DSC8660-1024x683.jpg",
      CDN + "_DSC8708-1024x683.jpg",
    ],
  },
];

// ===========================================================
// useReveal
// ===========================================================
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-stagger");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ===========================================================
// Reservation context
// ===========================================================
const ReservationCtx = React.createContext(null);
function useReservation() { return React.useContext(ReservationCtx); }

// ===========================================================
// Nav
// ===========================================================
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("HR");
  const { open } = useReservation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="nav-links">
        <a href="#o-nama">O nama</a>
        <a href="#sobe">Sobe</a>
        <a href="#krov">Krov</a>
        <a href="#kontakt">Kontakt</a>
      </div>
      <a href="#" className="brandmark">
        district<span className="dot">.</span>
        <sub>Boutique · Osijek</sub>
      </a>
      <div className="nav-right">
        <div className="lang-switch">
          {["HR", "EN", "DE"].map((l) => (
            <span key={l} className={lang === l ? "is-active" : ""} onClick={() => setLang(l)}>{l}</span>
          ))}
        </div>
        <button className="btn" onClick={() => open()}>
          Rezerviraj <span className="arrow">→</span>
        </button>
      </div>
    </nav>
  );
}

// ===========================================================
// Hero
// ===========================================================
function Hero() {
  const { open } = useReservation();
  return (
    <section className="hero" data-screen-label="00 Hero">
      <div className="hero-media" style={{ backgroundImage: `linear-gradient(180deg, rgba(26,23,20,0.45) 0%, rgba(26,23,20,0.15) 35%, rgba(26,23,20,0.65) 100%), url(${IMG.hero})` }}></div>
      <div className="hero-meta">
        <div>45.5550° N · 18.6955° E</div>
        <div>Osijek · Slavonija · HR</div>
        <div>Nekoliko minuta od Opus Arene</div>
      </div>
      <div className="hero-content">
        <div className="hero-eyebrow" data-reveal="fade-up">Boutique smještaj · Osijek · uz Dravu</div>
        <h1 className="hero-title" data-reveal="lines">
          District <em>Boutique</em>.
        </h1>
        <p className="hero-sub" data-reveal="fade-up" data-delay="0.15">
          Moderan boutique smještaj u Osijeku sa sezonskim vanjskim bazenom i jacuzzijima, besplatnim parkingom
          i Wi-Fi-jem, smješten na svega nekoliko minuta od Opus Arene. Prostrane, elegantno uređene sobe i
          apartmani za parove, poslovne goste i obitelji.
        </p>
        <div className="hero-cta-row" data-reveal="fade-up" data-delay="0.25">
          <button className="btn btn-ghost" onClick={() => open()}>Rezerviraj <span className="arrow">→</span></button>
          <a href="#sobe" className="hero-link">Otkrijte sobe</a>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Skrolaj za istraživanje</span>
        <div className="hero-scroll-line"></div>
      </div>
    </section>
  );
}

// ===========================================================
// Booking strip — opens flow
// ===========================================================
function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("hr-HR", { weekday: "short", day: "numeric", month: "short" });
}
function nightsBetween(a, b) {
  if (!a || !b) return 0;
  const ms = new Date(b) - new Date(a);
  return Math.max(0, Math.round(ms / (24 * 3600 * 1000)));
}

function Booking() {
  const { state, set, open } = useReservation();
  return (
    <div className="booking reveal" id="booking">
      <label className="booking-field">
        <span className="booking-label">Dolazak</span>
        <input className="booking-date" type="date" value={state.checkIn} onChange={(e) => set({ checkIn: e.target.value })} />
        <span className="booking-value">{fmtDate(state.checkIn)}</span>
      </label>
      <label className="booking-field">
        <span className="booking-label">Odlazak</span>
        <input className="booking-date" type="date" value={state.checkOut} onChange={(e) => set({ checkOut: e.target.value })} />
        <span className="booking-value">{fmtDate(state.checkOut)}</span>
      </label>
      <label className="booking-field">
        <span className="booking-label">Gosti</span>
        <select className="booking-date" value={state.guests} onChange={(e) => set({ guests: +e.target.value })}>
          {[1,2,3,4].map(n => <option key={n} value={n}>{n} {n === 1 ? "gost" : "gosta"}</option>)}
        </select>
        <span className="booking-value">{state.guests} {state.guests === 1 ? "gost" : "gosta"} <span className="sub">· {nightsBetween(state.checkIn, state.checkOut) || 3} noći</span></span>
      </label>
      <div className="booking-field">
        <span className="booking-label">Kategorija</span>
        <span className="booking-value">Sve sobe</span>
      </div>
      <button className="booking-cta" onClick={() => open()}>
        Provjeri dostupnost <span className="arrow">→</span>
      </button>
    </div>
  );
}

// ===========================================================
// About — editorial collage with GSAP-driven reveals
// ===========================================================
function About() {
  return (
    <section className="section about-section" id="o-nama" data-screen-label="01 O nama">
      <div className="about-head">
        <div className="chapter-label" data-reveal="fade-up">
          <span className="chapter-num">i.</span>
          <span>Capitulum · O nama</span>
        </div>
        <h2 className="about-title" data-reveal="lines">
          District Boutique. <em>Više od smještaja</em>.
        </h2>
      </div>

      <div className="about-grid">
        <div className="about-copy">
          <p data-reveal="fade-up" data-delay="0.05">
            District Boutique u Osijeku spaja tihu, elegantnu atmosferu s praktičnostima koje putovanje čine bezbrižnim.
            Prostrane, pažljivo uređene sobe i apartman nude udobnost za parove, poslovne goste i obitelji.
          </p>
          <p data-reveal="fade-up" data-delay="0.1">
            Besplatan privatni parking i brzi Wi-Fi osiguravaju lagodan boravak od prvog trenutka. Smješteni smo na
            odličnoj lokaciji, nekoliko minuta od Opus Arene i glavnih gradskih sadržaja — idealna polazišna točka
            za istraživanje Slavonije.
          </p>

          <div className="about-pull" data-reveal="fade-up" data-delay="0.15">
            <span className="pull-mark">“</span>
            <p>
              Tihi boutique nadomak Opus Arene koji vam vrati tjedan pred sobom — krov, jacuzzi i nečija pažnja za
              detalje koji se obično preskaču.
            </p>
            <cite>— Gost, kolovoz 2025.</cite>
          </div>
        </div>

        <div className="about-collage" data-reveal="stagger">
          <div className="collage-frame collage-1">
            <div className="curtain" data-reveal="curtain">
              <div className="curtain-inner" style={{ backgroundImage: `url(${IMG.about1})` }}></div>
            </div>
            <span className="collage-tag">01 · Eksterijer uz Dravu</span>
          </div>
          <div className="collage-frame collage-2">
            <div className="curtain" data-reveal="curtain">
              <div className="curtain-inner" style={{ backgroundImage: `url(${IMG.about2})` }}></div>
            </div>
            <span className="collage-tag">02 · Sobe</span>
          </div>
          <div className="collage-frame collage-3">
            <div className="curtain" data-reveal="curtain">
              <div className="curtain-inner" style={{ backgroundImage: `url(${IMG.about3})` }}></div>
            </div>
            <span className="collage-tag">03 · Detalji</span>
          </div>
        </div>
      </div>

      <div className="about-stats" data-reveal="stagger">
        <div className="stat">
          <span className="stat-num"><span data-count="4">0</span></span>
          <span className="stat-label">kategorije soba</span>
        </div>
        <div className="stat">
          <span className="stat-num"><span data-count="37">0</span>m²</span>
          <span className="stat-label">najveća suite</span>
        </div>
        <div className="stat">
          <span className="stat-num"><span data-count="2">0</span></span>
          <span className="stat-label">jacuzzia & bazen</span>
        </div>
        <div className="stat">
          <span className="stat-num"><span data-count="3">0</span>'</span>
          <span className="stat-label">do Opus Arene</span>
        </div>
        <div className="stat">
          <span className="stat-num"><span data-count="100" data-suffix="%">0</span></span>
          <span className="stat-label">privatni parking</span>
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// Rooms
// ===========================================================
function Rooms() {
  const { open } = useReservation();
  return (
    <section className="section" id="sobe" data-screen-label="02 Sobe">
      <div className="section-head">
        <h2 data-reveal="lines">Naše sobe.<br /><em>Premium · Deluxe · Suite · Jacuzzi Superior.</em></h2>
        <div className="head-text" data-reveal="fade-up" data-delay="0.1">
          <span className="chapter-label" style={{ marginBottom: 18 }}>
            <span className="chapter-num">ii.</span>
            <span>Capitulum · Sobe</span>
          </span>
          Odaberite prostor udobnosti i profinjenog dizajna. Sve jedinice dizajnirane su za miran, ugodan boravak:
          vrhunski ležajevi, klimatizacija i privatne kupaonice, uz besplatan Wi-Fi i privatni parking. Ljeti — sezonski
          vanjski bazen i dva jacuzzia.
        </div>
      </div>
      <div className="rooms-grid rooms-grid-4">
        {ROOMS.map((r) => (
          <article className="room-card" key={r.id}>
            <RoomImage room={r} />
            <div className="room-info">
              <h3>{r.name}</h3>
              <div className="room-price">od <b>€{r.price}</b> / noć</div>
            </div>
            <div className="room-meta">
              {r.meta.map((m, i) => (
                <span key={m} className="room-meta-item">
                  {i > 0 && <span className="dot"></span>}
                  <span>{m}</span>
                </span>
              ))}
            </div>
            <p className="room-desc">{r.summary}</p>
            <button className="room-book" onClick={() => open(r.id)}>Book now <span className="arrow">→</span></button>
          </article>
        ))}
      </div>
    </section>
  );
}

function RoomImage({ room }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);
  const onEnter = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % room.images.length);
    }, 1400);
  };
  const onLeave = () => {
    clearInterval(timer.current);
    setIdx(0);
  };
  return (
    <div className="room-image" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {room.images.slice(0, 4).map((src, i) => (
        <div
          key={src}
          className="room-image-layer"
          style={{ backgroundImage: `url(${src})`, opacity: i === idx ? 1 : 0 }}
        ></div>
      ))}
      <div className="room-num">№ {room.num} · {room.sqm}</div>
      <div className="room-dots">
        {room.images.slice(0, 4).map((_, i) => (
          <span key={i} className={i === idx ? "is-active" : ""}></span>
        ))}
      </div>
    </div>
  );
}

// ===========================================================
// Rooftop — editorial dark section
// ===========================================================
const ROOF_FEATURES = [
  {
    num: "I.", title: "Jacuzzi & chill",
    body: "Uživajte u jacuzziju pod otvorenim nebom, okruženi udobnim lounge sjedalima i mekanim vrećama za sjedenje. Prostor je zamišljen za sporo popodne, čašu vina i razgovor bez žurbe. Kad padne mrak, ambijentalna rasvjeta pretvara rooftop u intimnu dnevnu sobu na nebu.",
    img: IMG.rooftop[0],
    tag: "Sezonski · ljetni mjeseci",
  },
  {
    num: "II.", title: "Panorama nad Osijekom",
    body: "Otvoren pogled na Osijek pruža savršenu pozadinu za fotografije i video uspomene. Zalazak sunca i lampice iznad terase stvaraju poseban ugođaj koji je teško replicirati u zatvorenim prostorima.",
    img: IMG.rooftop[1],
    tag: "Najbolje · zalazak sunca",
  },
  {
    num: "III.", title: "Privatni najam",
    body: "Rooftop nudi dovoljno sjedećih mjesta, stabilan Wi-Fi i jednostavan pristup iz smještaja. Dostupan je sezonski, uz mogućnost unaprijed rezerviranog termina za privatne proslave, after-work druženja i mini evente.",
    img: IMG.rooftop[2],
    tag: "Po dogovoru",
  },
];

const ROOF_MANIFEST = [
  ["Bazen", "sezonski, vanjski"],
  ["Jacuzzia", "dva, pod otvorenim nebom"],
  ["Sjedenje", "lounge + bean bags"],
  ["Rasvjeta", "ambijentalna, dimmable"],
  ["Glazba", "vlastiti playlist"],
  ["Kapacitet", "do 24 osobe za privatni najam"],
  ["Wi-Fi", "pokriva cijelu terasu"],
  ["Otvoreno", "svibanj — rujan"],
];

function Rooftop() {
  return (
    <section className="rooftop" id="krov" data-screen-label="03 Krov">
      {/* Masthead — full bleed image with overlay heading */}
      <div className="rooftop-mast">
        <div className="rooftop-mast-image" data-parallax="0.3" style={{ backgroundImage: `linear-gradient(180deg, rgba(26,23,20,0.35) 0%, rgba(26,23,20,0.2) 50%, rgba(26,23,20,0.7) 100%), url(${IMG.rooftopHero})` }}></div>
        <div className="rooftop-mast-inner">
          <div className="chapter-label" data-reveal="fade-up">
            <span className="chapter-num">iii.</span>
            <span>Capitulum · Krov</span>
          </div>
          <h2 className="rooftop-headline" data-reveal="lines">
            Krov s pogledom. <em>Privatni</em> rooftop iznad Osijeka.
          </h2>
          <div className="rooftop-mast-meta">
            <span data-reveal="fade-up" data-delay="0.1">45.5550° N · 18.6955° E</span>
            <span data-reveal="fade-up" data-delay="0.16">Otvoreno svibanj — rujan</span>
            <span data-reveal="fade-up" data-delay="0.22">Najbolje · zalazak</span>
          </div>
        </div>
      </div>

      {/* Manifest — sticky list + scrolling photos */}
      <div className="rooftop-manifest-section">
        <div className="rooftop-manifest" data-reveal="fade-up">
          <span className="rooftop-manifest-eyebrow">Manifest</span>
          <h3>Što vas čeka <em>gore</em>.</h3>
          <dl className="rooftop-manifest-list">
            {ROOF_MANIFEST.map(([k, v]) => (
              <div key={k} className="rooftop-manifest-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <button className="btn btn-light rooftop-btn" onClick={() => document.querySelector("#kontakt").scrollIntoView({ block: "start" })}>
            Pošalji upit za rooftop <span className="arrow">→</span>
          </button>
        </div>

        <div className="rooftop-stack">
          <div className="curtain rooftop-stack-img rooftop-stack-1" data-reveal="curtain">
            <div className="curtain-inner" style={{ backgroundImage: `url(${IMG.rooftop[3]})` }}></div>
          </div>
          <div className="curtain rooftop-stack-img rooftop-stack-2" data-reveal="curtain">
            <div className="curtain-inner" style={{ backgroundImage: `url(${IMG.rooftop[0]})` }}></div>
          </div>
        </div>
      </div>

      {/* Three large editorial features */}
      <div className="rooftop-features">
        {ROOF_FEATURES.map((f, i) => (
          <article className={"rooftop-feature " + (i % 2 ? "reverse" : "")} key={f.num}>
            <div className="curtain rooftop-feat-image" data-reveal="curtain">
              <div className="curtain-inner" style={{ backgroundImage: `url(${f.img})` }}></div>
              <span className="rooftop-feat-tag">{f.tag}</span>
            </div>
            <div className="rooftop-feat-copy">
              <span className="rooftop-feat-num">{f.num}</span>
              <h3 data-reveal="lines">{f.title}</h3>
              <p data-reveal="fade-up" data-delay="0.1">{f.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ===========================================================
// Kontakt — editorial split layout
// ===========================================================
function Kontakt() {
  const [form, setForm] = useState({
    naziv: "", email: "", telefon: "", tip: "Rezervacija sobe", poruka: "",
  });
  const [channel, setChannel] = useState("email");
  const [sent, setSent] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => { e.preventDefault(); setSent(true); };

  const channels = [
    { id: "email", label: "E-mail", value: "support@district.hr", href: "mailto:support@district.hr" },
    { id: "phone", label: "Telefon", value: "+385 99 554 4337", href: "tel:+385995544337" },
    { id: "whatsapp", label: "WhatsApp", value: "+385 99 554 4337", href: "https://wa.me/385995544337" },
    { id: "ig", label: "Instagram", value: "@momentobydistrict", href: "https://instagram.com/momentobydistrict" },
  ];

  return (
    <section className="kontakt" id="kontakt" data-screen-label="05 Kontakt">
      {/* Header */}
      <div className="kontakt-mast">
        <div className="kontakt-mast-inner">
          <div className="chapter-label" data-reveal="fade-up">
            <span className="chapter-num">iv.</span>
            <span>Capitulum · Kontakt</span>
          </div>
          <h2 className="kontakt-headline" data-reveal="lines">
            Pišite nam. <em>Odgovor stiže</em> isti dan.
          </h2>
          <p className="kontakt-lead" data-reveal="fade-up" data-delay="0.1">
            Trebate ponudu za smještaj, privatni najam rooftopa ili imate posebne želje? Naš tim
            čita poruke unutar nekoliko sati i odgovara osobno — bez bota, bez forme za podršku.
          </p>
        </div>
      </div>

      <div className="kontakt-grid">
        {/* LEFT — channels + intel */}
        <aside className="kontakt-channels">
          <span className="kontakt-col-num">No. 01</span>
          <h3 data-reveal="fade-up">Preferirani kanal</h3>
          <ul className="kontakt-channel-list">
            {channels.map((c, i) => (
              <li key={c.id}>
                <a
                  href={c.href}
                  className={"kontakt-channel" + (channel === c.id ? " is-active" : "")}
                  onMouseEnter={() => setChannel(c.id)}
                  target={c.id === "ig" || c.id === "whatsapp" ? "_blank" : undefined}
                  rel="noopener"
                >
                  <span className="kontakt-channel-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="kontakt-channel-body">
                    <span className="kontakt-channel-label">{c.label}</span>
                    <span className="kontakt-channel-val">{c.value}</span>
                  </span>
                  <span className="kontakt-channel-arrow">→</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="kontakt-intel" data-reveal="stagger">
            <div className="kontakt-intel-row">
              <span className="kontakt-intel-key">Recepcija</span>
              <span className="kontakt-intel-val">0 — 24 h</span>
            </div>
            <div className="kontakt-intel-row">
              <span className="kontakt-intel-key">Rooftop</span>
              <span className="kontakt-intel-val">svibanj — rujan</span>
            </div>
            <div className="kontakt-intel-row">
              <span className="kontakt-intel-key">Adresa</span>
              <span className="kontakt-intel-val">Lj. Posavskog 7, Osijek</span>
            </div>
            <div className="kontakt-intel-row">
              <span className="kontakt-intel-key">Parking</span>
              <span className="kontakt-intel-val">privatni, uključen</span>
            </div>
          </div>
        </aside>

        {/* RIGHT — form */}
        <div className="kontakt-form-wrap">
          <span className="kontakt-col-num">No. 02</span>
          <h3 data-reveal="fade-up">Pošaljite poruku</h3>

          {sent ? (
            <div className="kontakt-sent" data-reveal="fade-up">
              <div className="kontakt-sent-mark">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="24" cy="24" r="22" />
                  <path d="M14 24.5l7 7 13-14" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>Hvala vam.</h4>
              <p>Poruka je zaprimljena. Javljamo se u roku od nekoliko sati, najčešće isti dan.</p>
              <button type="button" className="btn" onClick={() => { setSent(false); setForm({ naziv:"", email:"", telefon:"", tip:"Rezervacija sobe", poruka:"" }); }}>
                Nova poruka <span className="arrow">→</span>
              </button>
            </div>
          ) : (
            <form className="kontakt-form" onSubmit={submit} data-reveal="fade-up" data-delay="0.1">
              <label className="kfield">
                <span className="kfield-label">Ime i prezime <em>·</em></span>
                <input type="text" required value={form.naziv} onChange={update("naziv")} placeholder="Ana Horvat" />
              </label>
              <div className="kfield-row">
                <label className="kfield">
                  <span className="kfield-label">E-mail <em>·</em></span>
                  <input type="email" required value={form.email} onChange={update("email")} placeholder="ana@email.hr" />
                </label>
                <label className="kfield">
                  <span className="kfield-label">Telefon</span>
                  <input type="tel" value={form.telefon} onChange={update("telefon")} placeholder="+385 ..." />
                </label>
              </div>
              <label className="kfield">
                <span className="kfield-label">Tip upita</span>
                <select value={form.tip} onChange={update("tip")}>
                  <option>Rezervacija sobe</option>
                  <option>Najam rooftopa</option>
                  <option>Poslovni boravak</option>
                  <option>Posebna prilika</option>
                  <option>Drugo</option>
                </select>
              </label>
              <label className="kfield kfield-area">
                <span className="kfield-label">Poruka</span>
                <textarea rows="5" value={form.poruka} onChange={update("poruka")}
                  placeholder="Recite nam što tražite — termine, posebne želje, broj gostiju, povod..." />
              </label>
              <div className="kontakt-form-foot">
                <span className="kontakt-form-note">Odgovaramo unutar nekoliko sati. Bez auto-poruka.</span>
                <button type="submit" className="btn btn-solid">Pošalji upit <span className="arrow">→</span></button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// Footer — editorial closer
// ===========================================================
function useOsijekTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Approximate Osijek (CET/CEST). Local time of viewer in HR locale.
      setTime(now.toLocaleTimeString("hr-HR", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => { e.preventDefault(); if (email) setSent(true); };
  return (
    <form className="newsletter" onSubmit={onSubmit}>
      <label className="newsletter-label">Bilten · jedanput mjesečno, ništa više</label>
      {sent ? (
        <div className="newsletter-thanks">Hvala. <span>Prvi broj stiže uskoro.</span></div>
      ) : (
        <div className="newsletter-row">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vaš@email.hr" />
          <button type="submit">Pretplata <span className="arrow">→</span></button>
        </div>
      )}
    </form>
  );
}

function Footer() {
  const time = useOsijekTime();
  const year = new Date().getFullYear();
  return (
    <footer className="footer" data-screen-label="06 Footer">
      {/* Editorial sign-off */}
      <div className="footer-sign">
        <div className="footer-sign-grid">
          <div className="footer-meta-block" data-reveal="fade-up">
            <span className="footer-meta-key">Vrijeme u Osijeku</span>
            <span className="footer-meta-val">{time || "—:—"}</span>
          </div>
          <div className="footer-signoff" data-reveal="lines">
            <span className="footer-signoff-eyebrow">Do skorog</span>
            <h2>Vidimo se na <em>krovu</em>.</h2>
          </div>
          <div className="footer-meta-block right" data-reveal="fade-up">
            <span className="footer-meta-key">45.5550° N</span>
            <span className="footer-meta-val">18.6955° E</span>
          </div>
        </div>
      </div>

      {/* Mid: address card + newsletter + map */}
      <div className="footer-mid">
        <div className="footer-card footer-card-address" data-reveal="fade-up">
          <span className="footer-num">No. 01</span>
          <h4>Adresa & dolazak</h4>
          <p>
            <a href="https://maps.google.com/?q=Ljudevita+Posavskog+7+Osijek" target="_blank" rel="noopener">
              Ljudevita Posavskog 7<br />31000 Osijek, Hrvatska
            </a>
          </p>
          <ul className="footer-list">
            <li><span>Privatni parking</span><span>uključeno</span></li>
            <li><span>Wi-Fi</span><span>besplatan, brzi</span></li>
            <li><span>Check-in</span><span>od 15:00</span></li>
            <li><span>Check-out</span><span>do 11:00</span></li>
            <li><span>Domaća životinja</span><span>na upit</span></li>
          </ul>
        </div>

        <div className="footer-card footer-card-contact" data-reveal="fade-up" data-delay="0.08">
          <span className="footer-num">No. 02</span>
          <h4>Razgovor</h4>
          <ul className="footer-contact">
            <li>
              <span className="footer-contact-key">Email</span>
              <a href="mailto:support@district.hr">support@district.hr</a>
            </li>
            <li>
              <span className="footer-contact-key">Telefon</span>
              <a href="tel:+385995544337">+385 99 554 4337</a>
            </li>
            <li>
              <span className="footer-contact-key">Instagram</span>
              <a href="https://instagram.com/momentobydistrict" target="_blank" rel="noopener">@momentobydistrict</a>
            </li>
            <li>
              <span className="footer-contact-key">Facebook</span>
              <a href="#">/district.boutique.osijek</a>
            </li>
          </ul>
          <Newsletter />
        </div>

        <div className="footer-card footer-card-map" data-reveal="fade-up" data-delay="0.16">
          <span className="footer-num">No. 03</span>
          <h4>Karta</h4>
          <a className="footer-map" href="https://maps.google.com/?q=Ljudevita+Posavskog+7+Osijek" target="_blank" rel="noopener">
            <FooterMap />
            <span className="footer-map-cta">Otvori u Mapama <span className="arrow">→</span></span>
          </a>
          <ul className="footer-list footer-list-tight">
            <li><span>Opus Arena</span><span>3 min</span></li>
            <li><span>Tvrđa</span><span>8 min</span></li>
            <li><span>Promenada</span><span>2 min</span></li>
            <li><span>Aerodrom Osijek</span><span>20 min</span></li>
          </ul>
        </div>
      </div>

      {/* Marquee — moving editorial strip */}
      <div className="footer-marquee" aria-hidden="true">
        <div className="footer-marquee-track">
          {[0, 1].map((k) => [
            <span key={`a${k}`}>Boutique</span>,
            <span key={`b${k}`}>·</span>,
            <span key={`c${k}`}>Osijek</span>,
            <span key={`d${k}`}>·</span>,
            <span key={`e${k}`}>Krov & Jacuzzi</span>,
            <span key={`f${k}`}>·</span>,
            <span key={`g${k}`}>Drava</span>,
            <span key={`h${k}`}>·</span>,
            <span key={`i${k}`}>Opus Arena</span>,
            <span key={`j${k}`}>·</span>,
            <span key={`k${k}`}>MMXXVI</span>,
            <span key={`l${k}`}>·</span>,
          ])}
        </div>
      </div>

      {/* Massive wordmark closer */}
      <div className="footer-wordmark" data-reveal="curtain">
        <div className="curtain-inner footer-wordmark-inner">
          district<span className="dot">.</span>
        </div>
      </div>

      {/* Legal strip */}
      <div className="footer-legal">
        <div className="footer-legal-col">
          <span className="footer-legal-key">© {year}</span>
          <span>District d.o.o. · OIB 56282051463 · sva prava pridržana</span>
        </div>
        <div className="footer-legal-col footer-legal-mid">
          <a href="#">Privatnost</a>
          <a href="#">Uvjeti</a>
          <a href="#">Politika otkaza</a>
          <a href="#">Impressum</a>
        </div>
        <div className="footer-legal-col">
          <span className="footer-legal-key">Kreirao</span>
          <span>Front Tribe · redesign concept</span>
        </div>
      </div>
    </footer>
  );
}

function FooterMap() {
  // Stylized abstract map — Osijek street grid + Drava
  return (
    <svg viewBox="0 0 360 240" className="footer-map-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="dotgrid" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(244,239,231,0.12)" />
        </pattern>
      </defs>
      <rect width="360" height="240" fill="rgba(244,239,231,0.04)" />
      <rect width="360" height="240" fill="url(#dotgrid)" />
      {/* Drava */}
      <path d="M -10 70 C 60 50 120 95 200 80 S 320 60 380 90" stroke="rgba(244,239,231,0.5)" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.18" />
      <path d="M -10 70 C 60 50 120 95 200 80 S 320 60 380 90" stroke="rgba(244,239,231,0.7)" strokeWidth="1" fill="none" strokeDasharray="2 4" />
      {/* Streets */}
      <g stroke="rgba(244,239,231,0.35)" strokeWidth="0.6" fill="none">
        <line x1="0" y1="140" x2="360" y2="140" />
        <line x1="0" y1="170" x2="360" y2="170" />
        <line x1="0" y1="200" x2="360" y2="200" />
        <line x1="60" y1="100" x2="60" y2="240" />
        <line x1="120" y1="100" x2="120" y2="240" />
        <line x1="200" y1="100" x2="200" y2="240" />
        <line x1="260" y1="100" x2="260" y2="240" />
        <line x1="320" y1="100" x2="320" y2="240" />
      </g>
      {/* Hotel pin */}
      <g transform="translate(180, 155)">
        <circle r="22" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4">
          <animate attributeName="r" from="6" to="22" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="var(--accent)" />
        <circle r="9" fill="none" stroke="var(--accent)" strokeWidth="1" />
      </g>
      <text x="180" y="183" textAnchor="middle" fill="rgba(244,239,231,0.85)" fontSize="9" letterSpacing="2" fontFamily="ui-monospace, monospace">DISTRICT.</text>
      {/* Compass */}
      <g transform="translate(330, 30)" fill="rgba(244,239,231,0.45)">
        <text x="0" y="0" fontSize="9" textAnchor="middle" letterSpacing="2" fontFamily="ui-monospace, monospace">N</text>
        <line x1="0" y1="3" x2="0" y2="14" stroke="rgba(244,239,231,0.45)" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

// ===========================================================
// Reservation Modal — single-page editorial form
// ===========================================================
const HRK_RATE = 7.5345;
const ARRIVAL_TIMES = [
  "Odaberite stavku",
  "Do 12:00",
  "12:00 — 15:00",
  "15:00 — 18:00",
  "18:00 — 21:00",
  "Nakon 21:00",
  "Ne znam još",
];
const COUNTRIES = [
  "Odaberite zemlju",
  "Hrvatska", "Slovenija", "Njemačka", "Austrija", "Italija", "Mađarska",
  "Srbija", "Bosna i Hercegovina", "Crna Gora", "Francuska", "Nizozemska",
  "Ujedinjeno Kraljevstvo", "Sjedinjene Američke Države", "Drugo",
];

function fmtEUR(n) {
  return Number(n).toLocaleString("hr-HR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtCalDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
}
function fmtCalDay(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("hr-HR", { weekday: "long" });
}

function ReservationModal() {
  const { state, set, isOpen, close } = useReservation();
  const [submitted, setSubmitted] = useState(false);
  const [confirmCode] = useState(() => "DB-" + Math.random().toString(36).slice(2, 7).toUpperCase());

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const room = ROOMS.find((r) => r.id === state.room) || ROOMS[0];
  const nights = nightsBetween(state.checkIn, state.checkOut) || 0;
  const subtotal = room.price * nights;
  const total = subtotal;
  const hrk = (total * HRK_RATE).toFixed(2);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!state.checkIn || !state.checkOut || nights < 1) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rmodal" onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="rmodal-card rmodal-card-success">
          <button className="rmodal-close" onClick={close} aria-label="Zatvori">×</button>
          <div className="rsuccess">
            <svg width="64" height="64" viewBox="0 0 64 64" className="rsuccess-mark">
              <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M18 33l9 9 19-19" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <animate attributeName="stroke-dasharray" from="0 50" to="50 50" dur="0.7s" fill="freeze" />
              </path>
            </svg>
            <div className="chapter-label" style={{ justifyContent: "center" }}>
              <span className="chapter-num">✓</span>
              <span>Rezervacija zaprimljena</span>
            </div>
            <h2>Vidimo se u <em>Osijeku</em>.</h2>
            <p>
              Hvala vam, {state.guest.firstName || "dragi gost"}. Poslali smo potvrdu na <b>{state.guest.email || "vaš email"}</b>.
              Naš tim javlja se u roku od nekoliko sati s konačnom potvrdom termina.
            </p>
            <div className="rsuccess-code">
              <span>Broj rezervacije</span>
              <b>{confirmCode}</b>
            </div>
            <div className="rsuccess-actions">
              <button className="btn btn-solid" onClick={close}>Završi</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rmodal" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="rmodal-card rmodal-card-full">
        <header className="rmodal-head">
          <h3 className="rmodal-title">Rezervacija</h3>
          <button className="rmodal-close" onClick={close} aria-label="Zatvori">×</button>
        </header>

        <form className="rmodal-body" onSubmit={onSubmit}>
          {/* LEFT — Detalji rezervacije */}
          <div className="rmodal-left">
            <h4 className="rmodal-col-title">Detalji rezervacije</h4>

            <RoomSwitcher state={state} set={set} />

            <div className="rcard">
              <span className="rcard-label">Odaberite datume</span>
              <Calendar checkIn={state.checkIn} checkOut={state.checkOut} onChange={set} />
            </div>

            <div className="rcard">
              <div className="rcard-head">
                <span className="rcard-label">Odabrani datumi</span>
                {state.checkIn && state.checkOut && nights > 0 && (
                  <span className="rcard-tag">✓ Dostupno</span>
                )}
              </div>
              <div className="rdates">
                <div className="rdates-col">
                  <span className="rdates-label">Prijava</span>
                  <span className="rdates-val">{fmtCalDate(state.checkIn)}</span>
                  <span className="rdates-day">{fmtCalDay(state.checkIn)}</span>
                </div>
                <div className="rdates-arrow">→</div>
                <div className="rdates-col">
                  <span className="rdates-label">Odjava</span>
                  <span className="rdates-val">{fmtCalDate(state.checkOut)}</span>
                  <span className="rdates-day">{fmtCalDay(state.checkOut)}</span>
                </div>
              </div>
            </div>

            <div className="rcard">
              <div className="rcard-line">
                <span>Smještaj</span>
                <span className="rcard-money">€{fmtEUR(subtotal)}</span>
              </div>
              <div className="rcard-line rcard-line-total">
                <span>Ukupno</span>
                <span className="rcard-money">€{fmtEUR(total)}</span>
              </div>
              <div className="rcard-conv">= {fmtEUR(hrk)} HRK</div>
            </div>

            <div className="rcard">
              <div className="rcard-head">
                <span className="rcard-label">Smještaj</span>
                <span className="rcard-money rcard-money-strong">{fmtEUR(subtotal)} EUR</span>
              </div>
              <div className="rdetails">
                <div className="rdetails-row rdetails-strong">
                  {nights || "—"} × {room.name.toUpperCase()} · {fmtEUR(room.price)} EUR
                </div>
                <div className="rdetails-row mute">
                  Prijava {fmtCalDate(state.checkIn)} ({fmtCalDay(state.checkIn)}, od 15:00 — 21:00)
                </div>
                <div className="rdetails-row mute">
                  Odjava {fmtCalDate(state.checkOut)} ({fmtCalDay(state.checkOut)}, od 6:00 — 11:00)
                </div>
              </div>
            </div>

            <div className="rcard">
              <span className="rcard-label">Otkazna politika</span>
              <div className="rpolicy">
                <p>
                  Ne možete otkazati rezervaciju bez naknade. Naplatit će vam se {fmtEUR(total)} EUR
                  ako otkažete u bilo kojem trenutku.
                </p>
                <p>
                  <b>Dinamika naplate:</b><br />
                  Nakon potvrde rezervacije naplatit će se {fmtEUR(total)} EUR.
                </p>
                <p>
                  <b>No show:</b><br />
                  U slučaju nedolaska naplatit će vam se {fmtEUR(total)} EUR.
                </p>
              </div>
            </div>

            <div className="rcard rcard-total">
              <span className="rcard-total-label">Ukupna cijena</span>
              <div className="rcard-total-val">
                <span className="rcard-total-eur">{fmtEUR(total)} EUR</span>
                <span className="rcard-total-hrk">{fmtEUR(hrk)} HRK</span>
              </div>
            </div>

            <div className="rfoot-tax">
              <p>PDV (13 %) za smještaj je uključen u cijenu.</p>
              <p>PDV za usluge je uključen u cijenu.</p>
              <p>Tečaj: 1 EUR = 7,53450 HRK</p>
            </div>
          </div>

          {/* RIGHT — Detalji bookera */}
          <div className="rmodal-right">
            <h4 className="rmodal-col-title">Detalji bookera</h4>

            <div className="rform-row">
              <RInput label="Ime" required value={state.guest.firstName}
                onChange={(v) => set({ guest: { ...state.guest, firstName: v } })} />
              <RInput label="Prezime" required value={state.guest.lastName}
                onChange={(v) => set({ guest: { ...state.guest, lastName: v } })} />
            </div>
            <RInput label="E-mail" type="email" required icon="mail"
              value={state.guest.email}
              onChange={(v) => set({ guest: { ...state.guest, email: v } })} />
            <RInput label="Telefon" type="tel" required icon="phone"
              value={state.guest.phone}
              onChange={(v) => set({ guest: { ...state.guest, phone: v } })} />
            <RSelect label="Zemlja" value={state.guest.country}
              onChange={(v) => set({ guest: { ...state.guest, country: v } })}
              options={COUNTRIES} />
            <RSelect label="Predviđeno vrijeme dolaska" value={state.guest.arrival}
              onChange={(v) => set({ guest: { ...state.guest, arrival: v } })}
              options={ARRIVAL_TIMES} />
            <RTextarea label="Poruka"
              value={state.guest.notes}
              onChange={(v) => set({ guest: { ...state.guest, notes: v } })} />

            <div className="rform-section-head">Detalji gostiju</div>
            <div className="rform-steppers">
              <RStepper label="Odrasli" min={1} max={4} value={state.adults}
                onChange={(v) => set({ adults: v })} />
              <RStepper label="Djeca" min={0} max={3} value={state.children}
                onChange={(v) => set({ children: v })} />
            </div>
            <RStepper inline label="Broj soba" min={1} max={2} value={state.rooms}
              onChange={(v) => set({ rooms: v })} />

            <div className="rform-section-head">Potvrda rezervacije</div>
            <label className="rcheck">
              <input type="checkbox" checked={state.cardOwner}
                onChange={(e) => set({ cardOwner: e.target.checked })} />
              <span>Vlasnik kartice isti kao booker</span>
            </label>

            <RInput label="Broj kartice" icon="card" placeholder="0000 0000 0000 0000"
              value={state.card.number}
              onChange={(v) => set({ card: { ...state.card, number: v } })} />
            <div className="rform-row">
              <RInput label="CVV" placeholder="123" maxLength={4}
                value={state.card.cvv}
                onChange={(v) => set({ card: { ...state.card, cvv: v } })} />
              <RInput label="Datum isteka kartice" placeholder="MM/YY"
                value={state.card.expiry}
                onChange={(v) => set({ card: { ...state.card, expiry: v } })} />
            </div>

            <button type="submit" className="btn btn-solid rform-submit">
              Rezerviraj <span className="arrow">→</span>
            </button>

            <label className="rcheck rcheck-policy">
              <input type="checkbox" checked={state.policy}
                onChange={(e) => set({ policy: e.target.checked })} required />
              <span>Prihvaćam <a href="#">Pravila korištenja</a> i <a href="#">Politiku privatnosti</a>.</span>
            </label>

            <p className="rform-note">
              Vaša kartica neće biti odmah terećena. Vlasnik objekta će teretiti vašu karticu sukladno
              s uvjetima objekta.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// Room switcher (inline at top of left col)
// -----------------------------------------------------------
function RoomSwitcher({ state, set }) {
  const [open, setOpen] = useState(false);
  const room = ROOMS.find((r) => r.id === state.room) || ROOMS[0];
  return (
    <div className={"rroom-switch" + (open ? " is-open" : "")}>
      <button type="button" className="rroom-switch-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="rroom-switch-image" style={{ backgroundImage: `url(${room.images[0]})` }}></span>
        <span className="rroom-switch-info">
          <span className="rroom-switch-label">Vaš smještaj</span>
          <span className="rroom-switch-name">{room.name} <span className="rroom-switch-sqm">· {room.sqm}</span></span>
        </span>
        <span className="rroom-switch-price">€{room.price}<small>/noć</small></span>
        <span className="rroom-switch-toggle">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <ul className="rroom-switch-list">
          {ROOMS.map((r) => (
            <li key={r.id}>
              <button type="button"
                className={"rroom-switch-opt" + (r.id === state.room ? " is-active" : "")}
                onClick={() => { set({ room: r.id }); setOpen(false); }}>
                <span className="rroom-switch-opt-img" style={{ backgroundImage: `url(${r.images[0]})` }}></span>
                <span className="rroom-switch-opt-name">
                  {r.name} <small>· {r.sqm}</small>
                </span>
                <span className="rroom-switch-opt-price">€{r.price}<small>/noć</small></span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// -----------------------------------------------------------
// Form atoms
// -----------------------------------------------------------
function RInput({ label, value, onChange, type = "text", required, icon, placeholder, maxLength }) {
  return (
    <label className="rfield">
      <span className="rfield-label">{label}{required && <em>·</em>}</span>
      <span className="rfield-control">
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)}
          required={required} placeholder={placeholder} maxLength={maxLength} />
        {icon && <RIcon name={icon} />}
      </span>
    </label>
  );
}
function RSelect({ label, value, onChange, options }) {
  return (
    <label className="rfield">
      <span className="rfield-label">{label}</span>
      <span className="rfield-control rfield-control-select">
        <select value={value || options[0]} onChange={(e) => onChange(e.target.value)}>
          {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
        <svg className="rfield-chev" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </span>
    </label>
  );
}
function RTextarea({ label, value, onChange }) {
  return (
    <label className="rfield">
      <span className="rfield-label">{label}</span>
      <span className="rfield-control">
        <textarea rows="3" value={value || ""} onChange={(e) => onChange(e.target.value)}></textarea>
      </span>
    </label>
  );
}
function RStepper({ label, value, onChange, min = 0, max = 99, inline }) {
  return (
    <div className={"rstepper" + (inline ? " rstepper-inline" : "")}>
      <span className="rstepper-label">{label}</span>
      <div className="rstepper-row">
        <button type="button" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <span className="rstepper-val">{value}</span>
        <button type="button" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}
function RIcon({ name }) {
  const map = {
    mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="18" height="14"/><polyline points="3 7 12 13 21 7"/></svg>,
    phone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>,
    card: <svg width="18" height="14" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="2" width="20" height="14"/><line x1="2" y1="7" x2="22" y2="7"/></svg>,
  };
  return <span className="rfield-icon">{map[name]}</span>;
}

// -----------------------------------------------------------
// Calendar — 2 months side by side, range pick
// -----------------------------------------------------------
function Calendar({ checkIn, checkOut, onChange }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [viewStart, setViewStart] = useState(() => {
    const d = checkIn ? new Date(checkIn + "T00:00:00") : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const inDate = checkIn ? new Date(checkIn + "T00:00:00") : null;
  const outDate = checkOut ? new Date(checkOut + "T00:00:00") : null;
  const months = [new Date(viewStart), new Date(viewStart.getFullYear(), viewStart.getMonth() + 1, 1)];

  const toIso = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const clickDay = (d) => {
    if (d < today) return;
    if (!inDate || (inDate && outDate)) {
      onChange({ checkIn: toIso(d), checkOut: "" });
    } else if (d <= inDate) {
      onChange({ checkIn: toIso(d), checkOut: "" });
    } else {
      onChange({ checkOut: toIso(d) });
    }
  };

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const prevDisabled = months[0].getFullYear() < today.getFullYear()
    || (months[0].getFullYear() === today.getFullYear() && months[0].getMonth() <= today.getMonth());

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" className="cal-nav" disabled={prevDisabled}
          onClick={() => setViewStart(new Date(viewStart.getFullYear(), viewStart.getMonth() - 1, 1))}>‹</button>
        <div className="cal-titles">
          {months.map((m, i) => (
            <div key={i} className="cal-title">{cap(m.toLocaleDateString("hr-HR", { month: "long" }))} {m.getFullYear()}</div>
          ))}
        </div>
        <button type="button" className="cal-nav"
          onClick={() => setViewStart(new Date(viewStart.getFullYear(), viewStart.getMonth() + 1, 1))}>›</button>
      </div>
      <div className="cal-months">
        {months.map((m, i) => (
          <MonthGrid key={i} month={m} today={today} inDate={inDate} outDate={outDate} onPick={clickDay} />
        ))}
      </div>
    </div>
  );
}

function MonthGrid({ month, today, inDate, outDate, onPick }) {
  const year = month.getFullYear(), m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const firstWeekday = (new Date(year, m, 1).getDay() + 6) % 7; // Mon=0
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));
  const same = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  return (
    <div className="cal-month">
      <div className="cal-days">
        {['PON','UTO','SRI','ČET','PET','SUB','NED'].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-cells">
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="cal-cell cal-empty"></span>;
          const isPast = d < today;
          const isIn = same(d, inDate);
          const isOut = same(d, outDate);
          const isBetween = inDate && outDate && d > inDate && d < outDate;
          return (
            <button type="button" key={i} disabled={isPast}
              className={"cal-cell"
                + (isPast ? " cal-past" : "")
                + ((isIn || isOut) ? " cal-end" : "")
                + (isIn ? " cal-in" : "")
                + (isOut ? " cal-out" : "")
                + (isBetween ? " cal-between" : "")
              }
              onClick={() => onPick(d)}
            >{d.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
}

// ===========================================================
// Tweaks
// ===========================================================
function DistrictTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Paleta">
        <TweakColor label="Akcent" value={tweaks.accent} onChange={(v) => setTweak("accent", v)}
          options={["#8B3A3A", "#5C3A4E", "#6E4C3B", "#2F4A3E", "#9B7A5B"]} />
        <TweakRadio label="Base ton" value={tweaks.palette} onChange={(v) => setTweak("palette", v)}
          options={[
            { value: "cream", label: "Cream" },
            { value: "bone", label: "Bone" },
            { value: "alabaster", label: "Alabaster" },
            { value: "pearl", label: "Pearl" },
          ]} />
      </TweakSection>
      <TweakSection title="Tipografija">
        <TweakSelect label="Display font" value={tweaks.displayFont} onChange={(v) => setTweak("displayFont", v)}
          options={DISPLAY_FONTS.map((f) => ({ value: f, label: f }))} />
      </TweakSection>
    </TweaksPanel>
  );
}

// ===========================================================
// Root
// ===========================================================
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  // Init GSAP scroll animations after mount
  useEffect(() => {
    if (window.DBAnimations) {
      // small delay so images have layout
      const t = setTimeout(() => window.DBAnimations.init(), 80);
      return () => clearTimeout(t);
    }
  }, []);

  // Reservation state
  const [resState, setResState] = useState({
    checkIn: todayPlus(7),
    checkOut: todayPlus(10),
    adults: 2,
    children: 0,
    rooms: 1,
    room: "jacuzzi",
    guest: {
      firstName: "", lastName: "",
      email: "", phone: "",
      country: "Odaberite zemlju",
      arrival: "Odaberite stavku",
      notes: "",
    },
    cardOwner: true,
    card: { number: "", cvv: "", expiry: "" },
    policy: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const set = (patch) => setResState((s) => ({ ...s, ...patch }));
  const open = (roomId) => {
    if (roomId) set({ room: roomId });
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  // Apply palette
  useEffect(() => {
    const p = PALETTES[tweaks.palette] || PALETTES.cream;
    const root = document.documentElement.style;
    root.setProperty("--bg", p.bg);
    root.setProperty("--bg-2", p.bg2);
    root.setProperty("--bg-3", p.bg3);
    root.setProperty("--ink", p.ink);
    root.setProperty("--ink-soft", p.inkSoft);
    root.setProperty("--ink-mute", p.inkMute);
    root.setProperty("--accent", tweaks.accent);
    root.setProperty("--f-display", `"${tweaks.displayFont}", "Times New Roman", serif`);
  }, [tweaks.palette, tweaks.accent, tweaks.displayFont]);

  return (
    <ReservationCtx.Provider value={{ state: resState, set, isOpen, open, close }}>
      <Nav />
      <Hero />
      <About />
      <Rooms />
      <Rooftop />
      <Kontakt />
      <Footer />
      <ReservationModal />
      <DistrictTweaks tweaks={tweaks} setTweak={setTweak} />
    </ReservationCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
