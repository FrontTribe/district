/* eslint-disable */
// Direction C — Architectural Index (1440 × 900)
const IMG_C = {
  boutique: 'https://boutique.district.hr/api/media/file/_DSC8896.jpg',
  momento: 'https://boutique.district.hr/api/media/file/_DSC8819-1024x683.jpg',
  realEstate: 'https://boutique.district.hr/api/media/file/_DSC9307-480x320.jpg',
};

function DirectionC() {
  return (
    <div className="hub dirC">
      <header className="topbar">
        <div className="logo">district<span>.</span></div>
        <div className="meta">EST. MMXIX · OSIJEK</div>
        <div className="meta">N° 03 BRANDS</div>
        <div className="meta">45.555°N / 18.696°E</div>
        <div className="lang">
          <span className="active">HR</span>
          <span>·</span>
          <span>EN</span>
          <span>·</span>
          <span>DE</span>
        </div>
      </header>

      <div className="preface">
        <div>
          <div className="lbl">— Identity</div>
          <div className="val">A small <em>hospitality &amp; real-estate</em> group in Osijek.</div>
        </div>
        <div>
          <div className="lbl">— Composition</div>
          <div className="val">Three brands · one address · one team.</div>
        </div>
        <div>
          <div className="lbl">— Address</div>
          <div className="val">Ljudevita Posavskog 7 · 31000 Osijek</div>
        </div>
      </div>

      <div className="cols">
        <a className="col" href="https://boutique.district.hr">
          <div className="topline">
            <span className="idx">N° 01</span>
            <span className="status"><span className="dot"></span>Live</span>
          </div>
          <div className="imgwrap">
            <img src={IMG_C.boutique} alt=""/>
            <div className="crosshair">
              <div className="ch tl"></div>
              <div className="ch tr"></div>
              <div className="ch bl"></div>
              <div className="ch br"></div>
            </div>
            <div className="coord">45.555°N · 18.696°E · Floor 04</div>
          </div>
          <div className="body">
            <h2 className="name">Boutique<em>.</em></h2>
            <div className="typ">Hotel · Rooftop · Pool</div>
            <p className="desc">Small design hotel above the Drava. Five room types, rooftop pool, two jacuzzis, private parking.</p>
            <div className="visit"><span>boutique.district.hr</span><span>→</span></div>
          </div>
        </a>

        <a className="col" href="https://momento.district.hr">
          <div className="topline">
            <span className="idx">N° 02</span>
            <span className="status"><span className="dot"></span>Live</span>
          </div>
          <div className="imgwrap">
            <img src={IMG_C.momento} alt=""/>
            <div className="crosshair">
              <div className="ch tl"></div>
              <div className="ch tr"></div>
              <div className="ch bl"></div>
              <div className="ch br"></div>
            </div>
            <div className="coord">45.555°N · 18.696°E · Floor 00</div>
          </div>
          <div className="body">
            <h2 className="name">Momento<em>.</em></h2>
            <div className="typ">Restaurant · Bar · Late hours</div>
            <p className="desc">Long-table restaurant and bar. Seasonal Slavonian plates, slow evenings, late closing.</p>
            <div className="visit"><span>momento.district.hr</span><span>→</span></div>
          </div>
        </a>

        <a className="col soon">
          <div className="topline">
            <span className="idx">N° 03</span>
            <span className="status"><span className="dot"></span>Soon · 2026</span>
          </div>
          <div className="imgwrap">
            <img src={IMG_C.realEstate} alt=""/>
            <div className="crosshair">
              <div className="ch tl"></div>
              <div className="ch tr"></div>
              <div className="ch bl"></div>
              <div className="ch br"></div>
            </div>
            <div className="coord">45.555°N · 18.696°E · TBD</div>
          </div>
          <div className="body">
            <h2 className="name">Real <em>Estate.</em></h2>
            <div className="typ">Residences · Long stays</div>
            <p className="desc">Curated long-stay residences in central Osijek. A short, considered list. Launching late 2026.</p>
            <div className="visit"><span>Opening late 2026</span><span>—</span></div>
          </div>
        </a>
      </div>

      <div className="footerbar">
        <div>District d.o.o. · OIB 56282051463</div>
        <div>support@district.hr</div>
        <div>+385 99 554 4337</div>
        <div>© MMXXVI · All rights reserved</div>
      </div>
    </div>
  );
}
window.DirectionC = DirectionC;
