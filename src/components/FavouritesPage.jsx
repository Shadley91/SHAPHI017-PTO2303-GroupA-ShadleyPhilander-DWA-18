import { useState, useEffect } from "react"; // Importing necessary hooks from React
import { useLocation } from "react-router-dom"; // Importing useLocation hook from React Router DOM
import IconButton from "@mui/material/IconButton"; // Importing IconButton component from Material-UI
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Importing ArrowBackIcon component from Material-UI icons
import Button from "@mui/material/Button"; // Importing Button component from Material-UI
import Grid from "@mui/material/Grid"; // Importing Grid component from Material-UI
import DeleteIcon from "@mui/icons-material/Delete"; // Importing the trash can icon from Material-UI icons

const FavouritesPage = () => {
  // State variables for managing favourites and selected show
  const [favourites, setFavourites] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const location = useLocation(); // Using useLocation hook to get the current location

  useEffect(() => {
    // Load favorites from local storage when the component mounts
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
      setFavourites(storedFavorites);
    }
  }, []);

  const handleFavouritesBackButton = () => {
    // Go back to the previous page when back button is clicked
    window.history.back();
  };

  useEffect(() => {
    // Update selected show when location state changes
    if (location.state && location.state.show) {
      setSelectedShow(location.state.show);
    }
  }, [location.state]);

  const addToFavourites = () => {
    // Add selected show to favourites
    if (selectedShow) {
      const showToAdd = selectedShow;
      const showExists = favourites.some((fav) => fav.id === showToAdd.id);
      if (!showExists) {
        const newFavourites = [
          ...favourites,
          {
            id: showToAdd.id,
            title: showToAdd.title, // Add title here
            show: showToAdd.show,
            season: showToAdd.season,
            episode: showToAdd.episode,
            dateTimeAdded: new Date().toISOString(),
            image: showToAdd.image,
          },
        ];
        setFavourites(newFavourites);
        localStorage.setItem("favorites", JSON.stringify(newFavourites));
      }
    }
    setSelectedShow(null);
  };

  const removeFavourite = (id) => {
    // Remove favourite by id
    const updatedFavourites = favourites.filter((fav) => fav.id !== id);
    setFavourites(updatedFavourites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavourites));
  };

  const sortByShowAZ = () => {
    // Sort favourites alphabetically by show name (A-Z)
    const sortedFavourites = [...favourites].sort((a, b) =>
      a.show.localeCompare(b.show)
    );
    setFavourites(sortedFavourites);
  };

  const sortByShowZA = () => {
    // Sort favourites alphabetically by show name (Z-A)
    const sortedFavourites = [...favourites].sort((a, b) =>
      b.show.localeCompare(a.show)
    );
    setFavourites(sortedFavourites);
  };

  const sortByDateAsc = () => {
    // Sort favourites by date added in ascending order
    const sortedFavourites = [...favourites].sort(
      (a, b) => new Date(a.dateTimeAdded) - new Date(b.dateTimeAdded)
    );
    setFavourites(sortedFavourites);
  };

  const sortByDateDesc = () => {
    // Sort favourites by date added in descending order
    const sortedFavourites = [...favourites].sort(
      (a, b) => new Date(b.dateTimeAdded) - new Date(a.dateTimeAdded)
    );
    setFavourites(sortedFavourites);
  };

  return (
    <div>
      {/* Back button to navigate back */}
      <IconButton
        onClick={handleFavouritesBackButton}
        color="primary"
        aria-label="back"
      >
        <ArrowBackIcon />
      </IconButton>
      <h1>Favourites</h1>
      {/* Buttons for sorting favourites */}
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
      {/* Display selected show if exists */}
      {selectedShow && (
        <div>
          <p>
            {selectedShow.show} - Season {selectedShow.season}, Episode:{" "}
            {selectedShow.episode}
          </p>
          <img
            src={selectedShow.image}
            alt={selectedShow.show}
            style={{ width: "200px" }}
          />
          {/* Button to add selected show to favourites */}
          <Button onClick={addToFavourites} variant="contained" color="primary">
            Add to Favourites
          </Button>
        </div>
      )}
      {/* Display list of favourites */}
      {favourites.map((favourite) => (
        <div key={favourite.id}>
          <p>
            {favourite.title} - {favourite.show} - Season {favourite.season},
            Episode: {favourite.episode}
          </p>
          <img
            src={favourite.image}
            alt={favourite.show}
            style={{ width: "200px" }}
          />
          <p>
            Date and Time Added: {new Date(favourite.dateTimeAdded).toString()}
          </p>
          {/* Button to remove favourite */}
          <IconButton
            onClick={() => removeFavourite(favourite.id)}
            color="primary"
            aria-label="remove"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default FavouritesPage;
