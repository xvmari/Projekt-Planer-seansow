import { Link } from 'react-router-dom';
import { pobierzAdresPlakatu } from '../api/tmdb';

function KartaFilmu({
  film,
  statusNaLiscie,
  onDodajDoObejrzenia,
  onOznaczJakoObejrzane,
}) {
  const rokWydania = film.release_date ? film.release_date.slice(0, 4) : 'Brak daty';
  const ocenaTmdb = film.vote_average ? film.vote_average.toFixed(1) : '—';
  const typ = film.media_type === 'movie' ? 'Film' : 'Serial';
  const linkSzczegolow = `/anime/${film.media_type || 'tv'}/${film.id}`;

  return (
    <article className="karta-filmu">
      <Link to={linkSzczegolow}>
        <img
          src={pobierzAdresPlakatu(film.poster_path)}
          alt={`Plakat ${film.title}`}
          className="plakat-filmu"
        />
      </Link>

      <div className="opis-karty">
        <span className="etykieta-typu">{typ}</span>
        <h3 className="tytul-filmu">
          <Link to={linkSzczegolow}>{film.title}</Link>
        </h3>
        <p className="informacje-dodatkowe">
          <span>Rok: {rokWydania}</span> • <span>Ocena: {ocenaTmdb}</span>
        </p>

        <div className="grupa-przyciskow">
          <button
            type="button"
            className="przycisk"
            onClick={() => onDodajDoObejrzenia(film)}
            disabled={statusNaLiscie === 'do_obejrzenia'}
          >
            {statusNaLiscie === 'do_obejrzenia' ? 'W planach' : '+ Do obejrzenia'}
          </button>

          <button
            type="button"
            className="przycisk przycisk-obejrzane"
            onClick={() => onOznaczJakoObejrzane(film)}
            disabled={statusNaLiscie === 'obejrzane'}
          >
            {statusNaLiscie === 'obejrzane' ? 'Obejrzane ✓' : 'Obejrzałem'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default KartaFilmu;