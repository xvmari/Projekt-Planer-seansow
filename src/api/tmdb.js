const KLUCZ_API = import.meta.env.VITE_TMDB_API_KEY;
const ADRES_BAZOWY = 'https://api.themoviedb.org/3';
const ADRES_OBRAZKOW = 'https://image.tmdb.org/t/p/w500';

export function pobierzAdresPlakatu(sciezkaPlakatu) {
  if (!sciezkaPlakatu) {
    return 'https://via.placeholder.com/500x750?text=Brak+plakatu';
  }
  return `${ADRES_OBRAZKOW}${sciezkaPlakatu}`;
}

export async function pobierzPopularneFilmy() {
  if (!KLUCZ_API) {
    throw new Error('Brak klucza w pliku .env');
  }

  const response = await fetch(
    `${ADRES_BAZOWY}/movie/popular?api_key=${KLUCZ_API}&language=pl-PL&page=1`
  );

  if (!response.ok) {
    throw new Error('Nie udało się pobrać popularnych filmów z TMDb.');
  }

  const dane = await response.json();
  return dane.results || [];
}

export async function szukajFilmow(fraza) {
  if (!KLUCZ_API) {
    throw new Error('Brak klucza VITE_TMDB_API_KEY w pliku .env');
  }

  const oczyszczonaFraza = fraza.trim();
  if (!oczyszczonaFraza) {
    return pobierzPopularneFilmy();
  }

  const response = await fetch(
    `${ADRES_BAZOWY}/search/movie?api_key=${KLUCZ_API}&language=pl-PL&query=${encodeURIComponent(
      oczyszczonaFraza
    )}&page=1`
  );

  if (!response.ok) {
    throw new Error('Wystąpił błąd podczas wyszukiwania filmów.');
  }

  const dane = await response.json();
  return dane.results || [];
}

export async function pobierzSzczegolyFilmu(idFilmu) {
  if (!KLUCZ_API) {
    throw new Error('Brak klucza w pliku .env');
  }

  const response = await fetch(
    `${ADRES_BAZOWY}/movie/${idFilmu}?api_key=${KLUCZ_API}&language=pl-PL`
  );

  if (!response.ok) {
    throw new Error('Nie udało się pobrać szczegółów filmu.');
  }

  return response.json();
}