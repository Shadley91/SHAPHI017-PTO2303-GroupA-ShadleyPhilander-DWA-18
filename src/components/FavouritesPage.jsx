import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

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
        // Handle the error gracefully, such as displaying a message to the user
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
      <IconButton
        onClick={handleFavouritesBackButton}
        color="primary"
        aria-label="back"
      >
        <ArrowBackIcon />
      </IconButton>
      <h1>Favourites</h1>
      <Grid container spacing={2}>
        <Grid item>
          <Button onClick={sortByShowAZ} variant="contained" color="primary">
            Sort by Show A-Z
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={sortByShowZA} variant="contained" color="primary">
            Sort by Show Z-A
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={sortByDateAsc} variant="contained" color="primary">
            Sort by Date Ascending
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={sortByDateDesc} variant="contained" color="primary">
            Sort by Date Descending
          </Button>
        </Grid>
      </Grid>
      {favourites.map((favourite) => (
        <div key={favourite.id}>
          <p>
            {favourite.show} - Season {favourite.season}, Episode:{" "}
            {favourite.episode}
          </p>
          <p>Genre: {genreMapping[favourite.genreId]}</p>
          <p>Date and Time Added: {favourite.dateTimeAdded.toString()}</p>
          <Button
            onClick={() => removeFavourite(favourite.id)}
            variant="contained"
            color="primary"
          >
            Remove from favourites
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FavouritesPage;
