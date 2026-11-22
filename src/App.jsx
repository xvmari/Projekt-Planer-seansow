import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PasekNawigacji from './components/PasekNawigacji';
import StronaGlowna from './pages/StronaGlowna';

const KLUCZ_STORAGE = 'planer_seansow_filmy_v1';

function App() {
  const [zapisaneFilmy, setZapisaneFilmy] = useState(() => {
    try {
      const zapisane = localStorage.getItem(KLUCZ_STORAGE);
      return zapisane ? JSON.parse(zapisane) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KLUCZ_STORAGE, JSON.stringify(zapisaneFilmy));
    } catch {
      // Ignorujemy błąd zapisu do localStorage (np. tryb prywatny)
    }
  }, [zapisaneFilmy]);

  function dodajDoListy(film) {
    setZapisaneFilmy((poprzednie) => {
      const juzJest = poprzednie.some((item) => item.id === film.id);
      if (juzJest) {
        return poprzednie;
      }

      return [
        ...poprzednie,
        {
          id: film.id,
          title: film.title,
          poster_path: film.poster_path,
          release_date: film.release_date,
          vote_average: film.vote_average,
          status: 'do_obejrzenia',
          ocena: '',
          notatka: '',
        },
      ];
    });
  }

  return (
    <BrowserRouter>
      <PasekNawigacji liczbaNaLiscie={zapisaneFilmy.length} />
      <Routes>
        <Route
          path="/"
          element={
            <StronaGlowna
              zapisaneFilmy={zapisaneFilmy}
              onDodajDoListy={dodajDoListy}
            />
          }
        />
        <Route
          path="*"
          element={
            <StronaGlowna
              zapisaneFilmy={zapisaneFilmy}
              onDodajDoListy={dodajDoListy}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;