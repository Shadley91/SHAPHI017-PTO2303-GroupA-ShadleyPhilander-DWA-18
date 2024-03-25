import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [genreMapping, setGenreMapping] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleFavouritesBackButton = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      // Fetch favourites from localStorage or an API endpoint
      // Replace this with your actual method to fetch favourites
    };

    const fetchGenreMapping = async () => {
      try {
        const response = await axios.get(
          "https://podcast-api.netlify.app/genres"
        );
        const genres = response.data;
        const mapping = {};
        genres.forEach((genre) => {
          mapping[genre.id] = genre.title;
        });
        setGenreMapping(mapping);
      } catch (error) {
        console.error("Error fetching genre mapping:", error);
      }
    };

    fetchFavourites();
    fetchGenreMapping();
    setLoading(false);
  }, []);

  const removeFavourite = (id) => {
    setFavourites(favourites.filter((favourite) => favourite.id !== id));
    // Update localStorage or make API call to remove favourite
  };

  const sortByShowAZ = () => {
    setFavourites([...favourites.sort((a, b) => a.show.localeCompare(b.show))]);
  };

  const sortByShowZA = () => {
    setFavourites([...favourites.sort((a, b) => b.show.localeCompare(a.show))]);
  };

  const sortByDateAsc = () => {
    setFavourites([
      ...favourites.sort((a, b) => a.dateTimeAdded - b.dateTimeAdded),
    ]);
  };

  const sortByDateDesc = () => {
    setFavourites([
      ...favourites.sort((a, b) => b.dateTimeAdded - a.dateTimeAdded),
    ]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleFavouritesBackButton}>Back</button>
      <h1>Favourites</h1>
      <button onClick={sortByShowAZ}>Sort by Show A-Z</button>
      <button onClick={sortByShowZA}>Sort by Show Z-A</button>
      <button onClick={sortByDateAsc}>Sort by Date Ascending</button>
      <button onClick={sortByDateDesc}>Sort by Date Descending</button>
      {favourites.map((favourite) => (
        <div key={favourite.id}>
          <p>
            {favourite.show} - Season {favourite.season}, Episode:{" "}
            {favourite.episode}
          </p>
          <p>Genre: {genreMapping[favourite.genreId]}</p>
          <p>Date and Time Added: {favourite.dateTimeAdded.toString()}</p>
          <button onClick={() => removeFavourite(favourite.id)}>
            Remove from favourites
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavouritesPage;
