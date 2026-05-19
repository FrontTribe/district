/* eslint-disable */
// Direction A — Cinematic Triptych (1440 × 900)
const IMG_A = {
  boutique: 'https://boutique.district.hr/api/media/file/_DSC8896.jpg',
  momento: 'https://district.hr/api/media/file/momento-hero.jpg',
  realEstate: 'https://district.hr/api/media/file/real-estate-hero.jpg',
};

function DirectionA() {
  return (
    <div className="hub dirA">
      <header className="topbar">
        <div className="logo">district<span>.</span></div>
        <div className="place">Osijek · Slavonia · 2026</div>
        <div className="lang">
          <span className="active">HR</span>
          <span>·</span>
          <span>EN</span>
          <span>·</span>
          <span>DE</span>
        </div>
      </header>

      <div className="cols">
        <a className="col" href="https://boutique.district.hr">
          <div className="img" style={{backgroundImage: `url(${IMG_A.boutique})`}}></div>
          <div className="veil"></div>
          <div className="num">01 / Hotel</div>
          <div className="content">
            <div className="kicker">Rooms · Rooftop · Pool</div>
            <h2 className="name">Boutique<em>.</em></h2>
            <p className="desc">A small design hotel above the Drava — five room types, a rooftop pool, two jacuzzis and a quiet view over Osijek.</p>
            <span className="cta">Visit boutique <span>→</span></span>
          </div>
        </a>

        <a className="col" href="https://momento.district.hr">
          <div className="img" style={{backgroundImage: `url(${IMG_A.momento})`}}></div>
          <div className="veil"></div>
          <div className="num">02 / Table</div>
          <div className="content">
            <div className="kicker">Restaurant · Bar · Late hours</div>
            <h2 className="name">Momento<em>.</em></h2>
            <p className="desc">A long-table restaurant and bar built for slow evenings — seasonal Slavonian plates, a curated wine list, music that lets the conversation lead.</p>
            <span className="cta">Visit momento <span>→</span></span>
          </div>
        </a>

        <a className="col soon">
          <div className="img" style={{backgroundImage: `url(${IMG_A.realEstate})`}}></div>
          <div className="veil"></div>
          <div className="badge">Soon · 2026</div>
          <div className="num">03 / Residence</div>
          <div className="content">
            <div className="kicker">Residences · Long stays</div>
            <h2 className="name">Real <em>Estate.</em></h2>
            <p className="desc">A short, considered list of long-stay residences in central Osijek — designed for travellers who treat the city as a second address.</p>
            <span className="cta">Opening 2026 <span>—</span></span>
          </div>
        </a>
      </div>

      <div className="bottombar">
        <span>Ljudevita Posavskog 7 · 31000 Osijek</span>
        <span>support@district.hr · +385 99 554 4337</span>
        <a href="#">Instagram · Facebook</a>
      </div>
    </div>
  );
}
window.DirectionA = DirectionA;
