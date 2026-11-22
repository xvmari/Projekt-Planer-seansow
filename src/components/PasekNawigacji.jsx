import { NavLink } from 'react-router-dom';

function PasekNawigacji({ liczbaNaLiscie }) {
  return (
    <nav className="pasek-nawigacji">
      <div className="nazwa-aplikacji">Planer Seansów</div>
      <ul className="linki-nawigacji">
        <li>
          <NavLink to="/" end>
            Szukaj filmów
          </NavLink>
        </li>
        <li>
          <NavLink to="/lista">
            Moja lista ({liczbaNaLiscie})
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PasekNawigacji;