import { NavLink } from 'react-router-dom';

function PasekNawigacji({ liczbaDoObejrzenia, liczbaObejrzanych }) {
  return (
    <nav className="pasek-nawigacji">
      <div className="nazwa-aplikacji">Anime Planer & Tierlista</div>
      <ul className="linki-nawigacji">
        <li>
          <NavLink to="/" end>
            Wyszukiwarka
          </NavLink>
        </li>
        <li>
          <NavLink to="/do-obejrzenia">
            Do obejrzenia ({liczbaDoObejrzenia})
          </NavLink>
        </li>
        <li>
          <NavLink to="/obejrzane">
            Obejrzane i Tierlista ({liczbaObejrzanych})
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PasekNawigacji;