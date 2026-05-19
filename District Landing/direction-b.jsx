/* eslint-disable */
// Direction B — Editorial Cream (1440 × 900)
const IMG_B = {
  boutique: 'https://boutique.district.hr/api/media/file/_DSC8819-1024x683.jpg',
  momento: 'https://boutique.district.hr/api/media/file/_DSC8530%20(1)%202-1920x1280.jpg',
  realEstate: 'https://boutique.district.hr/api/media/file/_DSC9307-480x320.jpg',
};

function DirectionB() {
  return (
    <div className="hub dirB">
      <header className="topbar">
        <div className="logo">district<span>.</span></div>
        <div className="right">
          <div className="place">Osijek · Index N°01</div>
          <div className="lang">
            <span className="active">HR</span>
            <span>EN</span>
            <span>DE</span>
          </div>
        </div>
      </header>

      <div className="preface">
        <div className="label">— Three brands · one address</div>
        <p className="lede">A small hospitality group operating from a single block in Osijek — <em>a hotel, a table, a residence</em>. Choose a door.</p>
      </div>

      <div className="cols">
        <a className="col" href="https://boutique.district.hr">
          <div className="idx">
            <span>01 / 03</span>
            <span className="stat">Open</span>
          </div>
          <h2 className="name">Boutique<em>.</em></h2>
          <div className="typ">Hotel · Rooftop · Pool</div>
          <div className="photo"><img src={IMG_B.boutique} alt=""/></div>
          <p className="desc">A small design hotel above the Drava. Five room types, a rooftop pool and two jacuzzis.</p>
          <div className="visit">
            <span>Visit boutique</span>
            <span className="arr">→</span>
          </div>
        </a>

        <a className="col" href="https://momento.district.hr">
          <div className="idx">
            <span>02 / 03</span>
            <span className="stat">Open</span>
          </div>
          <h2 className="name">Momento<em>.</em></h2>
          <div className="typ">Restaurant · Bar · Late</div>
          <div className="photo"><img src={IMG_B.momento} alt=""/></div>
          <p className="desc">A long-table restaurant and bar. Slavonian seasonality, slow evenings, late hours.</p>
          <div className="visit">
            <span>Visit momento</span>
            <span className="arr">→</span>
          </div>
        </a>

        <a className="col soon">
          <div className="idx">
            <span>03 / 03</span>
            <span className="stat">Soon · 2026</span>
          </div>
          <h2 className="name">Real <em>Estate.</em></h2>
          <div className="typ">Residences · Long stays</div>
          <div className="photo"><img src={IMG_B.realEstate} alt=""/></div>
          <p className="desc">Long-stay residences in central Osijek — for travellers treating the city as a second address.</p>
          <div className="visit">
            <span>Opening 2026</span>
            <span className="arr">—</span>
          </div>
        </a>
      </div>

      <div className="footerbar">
        <span>Ljudevita Posavskog 7 · 31000 Osijek</span>
        <a href="mailto:support@district.hr">support@district.hr</a>
        <span>© 2026 · District d.o.o.</span>
      </div>
    </div>
  );
}
window.DirectionB = DirectionB;
