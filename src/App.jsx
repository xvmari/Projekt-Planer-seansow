import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PasekNawigacji from './components/PasekNawigacji';
import StronaGlowna from './pages/StronaGlowna';
import './index.css';

const KLUCZ_STORAGE = 'anime_planer_tierlista_v1';

function App() {
  const [zapisaneAnime, setZapisaneAnime] = useState(() => {
    try {
      const zapisane = localStorage.getItem(KLUCZ_STORAGE);
      return zapisane ? JSON.parse(zapisane) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KLUCZ_STORAGE, JSON.stringify(zapisaneAnime));
    } catch {
      // Ignorujemy błąd zapisu w localStorage
    }
  }, [zapisaneAnime]);

  function zapiszLubZaktualizujStatus(item, nowyStatus) {
    const typMediow = item.media_type || 'tv';

    setZapisaneAnime((poprzednie) => {
      const indeks = poprzednie.findIndex(
        (zapisany) =>
          zapisany.id === item.id && (zapisany.media_type || 'tv') === typMediow
      );

      if (indeks !== -1) {
        return poprzednie.map((zapisany, i) =>
          i === indeks
            ? {
                ...zapisany,
                status: nowyStatus,
                tier: nowyStatus === 'obejrzane' ? zapisany.tier || 'B' : zapisany.tier,
              }
            : zapisany
        );
      }

      return [
        ...poprzednie,
        {
          id: item.id,
          media_type: typMediow,
          title: item.title || item.name || 'Bez tytułu',
          poster_path: item.poster_path || '',
          release_date: item.release_date || item.first_air_date || '',
          vote_average: item.vote_average || 0,
          status: nowyStatus,
          tier: nowyStatus === 'obejrzane' ? 'B' : '',
          komentarz: '',
        },
      ];
    });
  }

  function dodajDoObejrzenia(item) {
    zapiszLubZaktualizujStatus(item, 'do_obejrzenia');
  }

  function oznaczJakoObejrzane(item) {
    zapiszLubZaktualizujStatus(item, 'obejrzane');
  }

  function ustawTierIKomentarz(idPozycji, typMediow, nowyTier, nowyKomentarz) {
    setZapisaneAnime((poprzednie) =>
      poprzednie.map((zapisany) =>
        zapisany.id === idPozycji && (zapisany.media_type || 'tv') === (typMediow || 'tv')
          ? {
              ...zapisany,
              status: 'obejrzane',
              tier: nowyTier,
              komentarz: nowyKomentarz,
            }
          : zapisany
      )
    );
  }

  function usunZListy(idPozycji, typMediow) {
    setZapisaneAnime((poprzednie) =>
      poprzednie.filter(
        (zapisany) =>
          !(
            zapisany.id === idPozycji &&
            (zapisany.media_type || 'tv') === (typMediow || 'tv')
          )
      )
    );
  }

  return (
    <BrowserRouter>
      <PasekNawigacji liczbaNaLiscie={zapisaneAnime.length} />
      <Routes>
        <Route
          path="/"
          element={
            <StronaGlowna
              zapisaneAnime={zapisaneAnime}
              onDodajDoObejrzenia={dodajDoObejrzenia}
              onOznaczJakoObejrzane={oznaczJakoObejrzane}
            />
          }
        />
        <Route
          path="*"
          element={
            <StronaGlowna
              zapisaneAnime={zapisaneAnime}
              onDodajDoObejrzenia={dodajDoObejrzenia}
              onOznaczJakoObejrzane={oznaczJakoObejrzane}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;