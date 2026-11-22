const KLUCZ_API = import.meta.env.VITE_TMDB_API_KEY;
const ADRES_BAZOWY = 'https://api.themoviedb.org/3';
const ADRES_OBRAZKOW = 'https://image.tmdb.org/t/p/w500';

// Zakładki na samej górze: klucz = ID dodatkowego gatunku w TMDb (lub pusty dla wszystkich anime)
export const ZAKLADKI_ANIME = [
  { id: 'wszystkie', nazwa: 'Wszystkie anime', idGatunku: '' },
  { id: 'romantyczne', nazwa: 'Romantyczne', idGatunku: '10749' },
  { id: 'supernatural', nazwa: 'Supernatural / Fantasy', idGatunku: '10765' },
  { id: 'akcja', nazwa: 'Akcja i przygoda', idGatunku: '10759' },
  { id: 'dramat', nazwa: 'Dramat', idGatunku: '18' },
];

export function pobierzAdresPlakatu(sciezkaPlakatu) {
  if (!sciezkaPlakatu) {
    return 'https://via.placeholder.com/500x750?text=Brak+plakatu';
  }
  return `${ADRES_OBRAZKOW}${sciezkaPlakatu}`;
}

function czyWygladaNaAnime(tytul) {
  return Boolean(tytul);
}

// Pobiera popularne anime (filmy i seriale z gatunku Animacja w języku japońskim)
export async function pobierzAnimePoZakladce(idGatunku = '') {
  if (!KLUCZ_API) {
    throw new Error('Brak klucza VITE_TMDB_API_KEY w pliku .env');
  }

  const gatunki = idGatunku ? `16,${idGatunku}` : '16';
  const wspolneParametry = `api_key=${KLUCZ_API}&language=pl-PL&with_original_language=ja&with_genres=${gatunki}&sort_by=popularity.desc&page=1`;

  const [responseSeriale, responseFilmy] = await Promise.all([
    fetch(`${ADRES_BAZOWY}/discover/tv?${wspolneParametry}`),
    fetch(`${ADRES_BAZOWY}/discover/movie?${wspolneParametry}`),
  ]);

  if (!responseSeriale.ok || !responseFilmy.ok) {
    throw new Error('Nie udało się pobrać listy anime z TMDb.');
  }

  const daneSeriale = await responseSeriale.json();
  const daneFilmy = await responseFilmy.json();

  // Ujednolicamy pola (seriale mają "name" i "first_air_date", filmy "title" i "release_date")
  const seriale = (daneSeriale.results || []).map((item) => ({
    ...item,
    media_type: 'tv',
    title: item.name,
    release_date: item.first_air_date || '',
  }));

  const filmy = (daneFilmy.results || []).map((item) => ({
    ...item,
    media_type: 'movie',
    title: item.title,
    release_date: item.release_date || '',
  }));

  return [...seriale, ...filmy].filter((item) => czyWygladaNaAnime(item.title));
}

// Wyszukuje anime po wpisanej frazie (i filtruje tak, aby zostawiać głównie anime)
export async function szukajAnime(fraza, idGatunku = '') {
  if (!KLUCZ_API) {
    throw new Error('Brak klucza VITE_TMDB_API_KEY w pliku .env');
  }

  const oczyszczonaFraza = fraza.trim();
  if (!oczyszczonaFraza) {
    return pobierzAnimePoZakladce(idGatunku);
  }

  const zakodowanaFraza = encodeURIComponent(oczyszczonaFraza);

  const [responseSeriale, responseFilmy] = await Promise.all([
    fetch(
      `${ADRES_BAZOWY}/search/tv?api_key=${KLUCZ_API}&language=pl-PL&query=${zakodowanaFraza}&page=1`
    ),
    fetch(
      `${ADRES_BAZOWY}/search/movie?api_key=${KLUCZ_API}&language=pl-PL&query=${zakodowanaFraza}&page=1`
    ),
  ]);

  if (!responseSeriale.ok || !responseFilmy.ok) {
    throw new Error('Wystąpił błąd podczas wyszukiwania anime.');
  }

  const daneSeriale = await responseSeriale.json();
  const daneFilmy = await responseFilmy.json();

  const polaczone = [
    ...(daneSeriale.results || []).map((item) => ({
      ...item,
      media_type: 'tv',
      title: item.name,
      release_date: item.first_air_date || '',
    })),
    ...(daneFilmy.results || []).map((item) => ({
      ...item,
      media_type: 'movie',
      title: item.title,
      release_date: item.release_date || '',
    })),
  ];

  // Zostawiamy pozycje z gatunkiem Animacja (16) lub oryginalnym językiem japońskim ('ja')
  const tylkoAnime = polaczone.filter((item) => {
    const maGatunekAnimacji = Array.isArray(item.genre_ids) && item.genre_ids.includes(16);
    const jestJaponskie = item.original_language === 'ja';
    return maGatunekAnimacji || jestJaponskie;
  });

  if (!idGatunku) {
    return tylkoAnime;
  }

  const numerGatunku = Number(idGatunku);
  return tylkoAnime.filter(
    (item) => Array.isArray(item.genre_ids) && item.genre_ids.includes(numerGatunku)
  );
}

export async function pobierzSzczegolyAnime(idPozycji, typMediow = 'tv') {
  if (!KLUCZ_API) {
    throw new Error('Brak klucza VITE_TMDB_API_KEY w pliku .env');
  }

  const sciezka = typMediow === 'movie' ? 'movie' : 'tv';
  const response = await fetch(
    `${ADRES_BAZOWY}/${sciezka}/${idPozycji}?api_key=${KLUCZ_API}&language=pl-PL`
  );

  if (!response.ok) {
    throw new Error('Nie udało się pobrać szczegółów anime.');
  }

  const dane = await response.json();
  return {
    ...dane,
    media_type: sciezka,
    title: dane.title || dane.name || 'Bez tytułu',
    release_date: dane.release_date || dane.first_air_date || '',
  };
}