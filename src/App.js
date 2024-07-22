import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { MovieCard } from "./components/MovieCard";
import Youtube from "react-youtube";

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedMovie, setSelectedMovie] = useState({});
  const [playTrailer, setPlayTrailer] = useState(false);
  const [style, setStyle] = useState({ display: "none" });

  console.log("API Key:", process.env.REACT_APP_MOVIE_API_KEY);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    try {
      const fetchedData = await axios.get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: process.env.REACT_APP_MOVIE_API_KEY,
          query: searchKey,
        },
      });
      const res = fetchedData.data.results;

      await selectMovie(res[0]);
      setMovies(res);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchMovie = async (id) => {
    try {
      const data = await axios.get(`${API_URL}/movie/${id}`, {
        params: {
          api_key: process.env.REACT_APP_MOVIE_API_KEY,
          append_to_response: "videos",
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };

  const selectMovie = async (movie) => {
    const { data } = await fetchMovie(movie.id);
    console.log("movie data:", data);
    setSelectedMovie(data);
    setPlayTrailer(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  const renderTrailer = () => {
    if (selectedMovie.videos && selectedMovie.videos.results.length > 0) {
      const trailer = selectedMovie.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;
      return (
        <Youtube
          videoId={key}
          className={"youtube-container"}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
            },
          }}
        />
      );
    }
    return null;
  };

  const renderMovies = () => {
    return movies.map((movie) => {
      return (
        <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
      );
    });
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content max-center">
          <h1>Movie Zone</h1>
          <form onSubmit={searchMovies}>
            <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <div
        className="hero"
        style={{
          backgroundImage: `url(${IMAGE_PATH}${selectedMovie.backdrop_path})`,
        }}
      >
        <div className="hero-content max-center">
          {playTrailer ? (
            <button
              className="trailer-button close-button"
              onClick={() => setPlayTrailer(false)}
            >
              Close
            </button>
          ) : null}
          {selectedMovie.videos && playTrailer ? renderTrailer() : null}
          <button
            className="trailer-button"
            onClick={() => setPlayTrailer(true)}
          >
            Play Trailer
          </button>
          <h1 className="hero-title">{selectedMovie.title}</h1>
          {selectedMovie.overview ? (
            <p className="hero-overview">{selectedMovie.overview}</p>
          ) : null}
        </div>
      </div>

      <div className="container max-center">{renderMovies()}</div>
    </div>
  );
}

export default App;
