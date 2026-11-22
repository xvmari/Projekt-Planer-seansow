import { Link } from 'react-router-dom';
import { pobierzAdresPlakatu } from '../api/tmdb';

function KartaFilmu({ film, czyZapisany, onDodajDoListy }) {
  const rokWydania = film.release_date ? film.release_date.slice(0, 4) : 'Brak daty';
  const ocenaTmdb = film.vote_average ? film.vote_average.toFixed(1) : '—';

  return (
    <article className="karta-filmu">
      <Link to={`/film/${film.id}`}>
        <img
          src={pobierzAdresPlakatu(film.poster_path)}
          alt={`Plakat filmu ${film.title}`}
          className="plakat-filmu"
        />
      </Link>

      <div className="opis-karty">
        <h3 className="tytul-filmu">
          <Link to={`/film/${film.id}`}>{film.title}</Link>
        </h3>
        <p className="informacje-dodatkowe">
          <span>Rok: {rokWydania}</span> • <span>Ocena TMDb: {ocenaTmdb}</span>
        </p>

        <button
          type="button"
          className="przycisk"
          onClick={() => onDodajDoListy(film)}
          disabled={czyZapisany}
        >
          {czyZapisany ? 'Na liście' : '+ Do obejrzenia'}
        </button>
      </div>
    </article>
  );
}

export default KartaFilmu;