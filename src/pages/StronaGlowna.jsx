import { useState, useEffect } from 'react';
import {
  ZAKLADKI_ANIME,
  pobierzAnimePoZakladce,
  szukajAnime,
} from '../api/tmdb';
import KartaFilmu from '../components/KartaFilmu';

function StronaGlowna({
  zapisaneAnime,
  onDodajDoObejrzenia,
  onOznaczJakoObejrzane,
}) {
  const [aktywnaZakladka, setAktywnaZakladka] = useState(ZAKLADKI_ANIME[0]);
  const [fraza, setFraza] = useState('');
  const [listaAnime, setListaAnime] = useState([]);
  const [czyLaduje, setCzyLaduje] = useState(true);
  const [blad, setBlad] = useState('');

  useEffect(() => {
    let anulowane = false;

    async function zaladujAnime() {
      setCzyLaduje(true);
      setBlad('');

      try {
        const wyniki = fraza.trim()
          ? await szukajAnime(fraza, aktywnaZakladka.idGatunku)
          : await pobierzAnimePoZakladce(aktywnaZakladka.idGatunku);

        if (!anulowane) {
          setListaAnime(wyniki);
        }
      } catch (err) {
        if (!anulowane) {
          setBlad(err.message || 'Nie udało się pobrać anime.');
        }
      } finally {
        if (!anulowane) {
          setCzyLaduje(false);
        }
      }
    }

    zaladujAnime();

    return () => {
      anulowane = true;
    };
  }, [aktywnaZakladka]);

  async function obsluzWyszukiwanie(e) {
    e.preventDefault();
    setCzyLaduje(true);
    setBlad('');

    try {
      const wyniki = await szukajAnime(fraza, aktywnaZakladka.idGatunku);
      setListaAnime(wyniki);
    } catch (err) {
      setBlad(err.message || 'Błąd podczas wyszukiwania anime.');
    } finally {
      setCzyLaduje(false);
    }
  }

  function pobierzStatusAnime(item) {
    const znaleziony = zapisaneAnime.find(
      (zapisany) =>
        zapisany.id === item.id &&
        (zapisany.media_type || 'tv') === (item.media_type || 'tv')
    );
    return znaleziony ? znaleziony.status : null;
  }

  return (
    <main className="kontener">
      <div className="pasek-zakladek-gornych" role="tablist" aria-label="Gatunki anime">
        {ZAKLADKI_ANIME.map((zakladka) => {
          const czyAktywna = zakladka.id === aktywnaZakladka.id;
          return (
            <button
              key={zakladka.id}
              type="button"
              role="tab"
              aria-selected={czyAktywna}
              className={`zakladka-gorna ${czyAktywna ? 'aktywna' : ''}`}
              onClick={() => setAktywnaZakladka(zakladka)}
            >
              {zakladka.nazwa}
            </button>
          );
        })}
      </div>

      <h1>Wyszukiwarka anime — {aktywnaZakladka.nazwa}</h1>
      <p className="opis-strony">
        Przeglądaj anime według zakładek lub wyszukaj tytuł, dodawaj do listy „Do obejrzenia” albo oznaczaj jako „Obejrzane”.
      </p>

      <form onSubmit={obsluzWyszukiwanie} className="formularz-wyszukiwania">
        <input
          type="text"
          value={fraza}
          onChange={(e) => setFraza(e.target.value)}
          placeholder="Wpisz tytuł anime, np. Your Name, Naruto, Frieren..."
          className="pole-tekstowe"
        />
        <button type="submit" className="przycisk">
          Szukaj
        </button>
      </form>

      {czyLaduje && <p className="komunikat">Ładowanie anime...</p>}

      {!czyLaduje && blad && (
        <p className="komunikat blad">Błąd: {blad}</p>
      )}

      {!czyLaduje && !blad && listaAnime.length === 0 && (
        <p className="komunikat">Nie znaleziono anime pasujących do wybranych kryteriów.</p>
      )}

      {!czyLaduje && !blad && listaAnime.length > 0 && (
        <section className="siatka-filmow">
          {listaAnime.map((item) => (
            <KartaFilmu
              key={`${item.media_type}-${item.id}`}
              film={item}
              statusNaLiscie={pobierzStatusAnime(item)}
              onDodajDoObejrzenia={onDodajDoObejrzenia}
              onOznaczJakoObejrzane={onOznaczJakoObejrzane}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default StronaGlowna;