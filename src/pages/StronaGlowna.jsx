import { useState, useEffect } from 'react';
import { pobierzPopularneFilmy, szukajFilmow } from '../api/tmdb';
import KartaFilmu from '../components/KartaFilmu';

function StronaGlowna({ zapisaneFilmy, onDodajDoListy }) {
  const [fraza, setFraza] = useState('');
  const [filmy, setFilmy] = useState([]);
  const [czyLaduje, setCzyLaduje] = useState(true);
  const [blad, setBlad] = useState('');

  useEffect(() => {
    let anulowane = false;

    async function zaladujFilmy() {
      setCzyLaduje(true);
      setBlad('');

      try {
        const wyniki = await pobierzPopularneFilmy();
        if (!anulowane) {
          setFilmy(wyniki);
        }
      } catch (err) {
        if (!anulowane) {
          setBlad(err.message || 'Nie udało się pobrać filmów.');
        }
      } finally {
        if (!anulowane) {
          setCzyLaduje(false);
        }
      }
    }

    zaladujFilmy();

    return () => {
      anulowane = true;
    };
  }, []);

  async function obsluzWyszukiwanie(e) {
    e.preventDefault();
    setCzyLaduje(true);
    setBlad('');

    try {
      const wyniki = await szukajFilmow(fraza);
      setFilmy(wyniki);
    } catch (err) {
      setBlad(err.message || 'Błąd podczas wyszukiwania.');
    } finally {
      setCzyLaduje(false);
    }
  }

  return (
    <main className="kontener">
      <h1>Planer seansów — wyszukiwarka filmów</h1>
      <p className="opis-strony">
        Wyszukaj film w bazie TMDb, wejdź w szczegóły lub dodaj go do swojej listy „Do obejrzenia”.
      </p>

      <form onSubmit={obsluzWyszukiwanie} className="formularz-wyszukiwania">
        <input
          type="text"
          value={fraza}
          onChange={(e) => setFraza(e.target.value)}
          placeholder="Wpisz tytuł filmu, np. Incepcja..."
          className="pole-tekstowe"
        />
        <button type="submit" className="przycisk">
          Szukaj
        </button>
      </form>

      {czyLaduje && <p className="komunikat">Ładowanie filmów...</p>}

      {!czyLaduje && blad && (
        <p className="komunikat blad">Błąd: {blad}</p>
      )}

      {!czyLaduje && !blad && filmy.length === 0 && (
        <p className="komunikat">Nie znaleziono filmów pasujących do zapytania.</p>
      )}

      {!czyLaduje && !blad && filmy.length > 0 && (
        <section className="siatka-filmow">
          {filmy.map((film) => {
            const czyZapisany = zapisaneFilmy.some((item) => item.id === film.id);
            return (
              <KartaFilmu
                key={film.id}
                film={film}
                czyZapisany={czyZapisany}
                onDodajDoListy={onDodajDoListy}
              />
            );
          })}
        </section>
      )}
    </main>
  );
}

export default StronaGlowna;