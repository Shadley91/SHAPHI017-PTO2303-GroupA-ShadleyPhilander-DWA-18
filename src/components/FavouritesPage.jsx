import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
      setFavourites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.show) {
      setSelectedShow(location.state.show);
    }
  }, [location.state]);

  const handleFavouritesBackButton = () => {
    window.history.back();
  };

  const addToFavourites = () => {
    if (selectedShow) {
      const showToAdd = selectedShow;
      const showExists = favourites.some((fav) => fav.id === showToAdd.id);
      if (!showExists) {
        const newFavourites = [
          ...favourites,
          {
            id: showToAdd.id,
            title: showToAdd.title,
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
    const updatedFavourites = favourites.filter((fav) => fav.id !== id);
    setFavourites(updatedFavourites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavourites));
  };

  const sortFavouritesByTitleAZ = () => {
    const sortedFavourites = [...favourites].sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    setFavourites(sortedFavourites);
  };

  const sortFavouritesByTitleZA = () => {
    const sortedFavourites = [...favourites].sort((a, b) =>
      b.title.toLowerCase().localeCompare(a.title.toLowerCase())
    );
    setFavourites(sortedFavourites);
  };

  const sortByDateAsc = () => {
    const sortedFavourites = [...favourites].sort(
      (a, b) => new Date(a.dateTimeAdded) - new Date(b.dateTimeAdded)
    );
    setFavourites(sortedFavourites);
  };

  const sortByDateDesc = () => {
    const sortedFavourites = [...favourites].sort(
      (a, b) => new Date(b.dateTimeAdded) - new Date(a.dateTimeAdded)
    );
    setFavourites(sortedFavourites);
  };

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
          <Button
            onClick={sortFavouritesByTitleAZ}
            variant="contained"
            color="primary"
          >
            Sort by Title A-Z
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={sortFavouritesByTitleZA}
            variant="contained"
            color="primary"
          >
            Sort by Title Z-A
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
          <Button onClick={addToFavourites} variant="contained" color="primary">
            Add to Favourites
          </Button>
        </div>
      )}
      {favourites.length > 0 ? (
        favourites.map((favourite) => (
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
              Date and Time Added:{" "}
              {new Date(favourite.dateTimeAdded).toString()}
            </p>
            <IconButton
              onClick={() => removeFavourite(favourite.id)}
              color="primary"
              aria-label="remove"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))
      ) : (
        <p>No favourites added yet.</p>
      )}
    </div>
  );
};

export default FavouritesPage;
