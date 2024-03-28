import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete"; // Import the trash can icon

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const location = useLocation();

  const handleFavouritesBackButton = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(
          "https://podcast-api.netlify.app/favourites"
        );
        setFavourites(response.data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      }
    };

    fetchFavourites();
  }, []);

  useEffect(() => {
    if (location.state && location.state.show) {
      setSelectedShow(location.state.show);
    }
  }, [location.state]);

  const addToFavourites = () => {
    if (selectedShow) {
      const showToAdd = selectedShow;
      const showExists = favourites.some((fav) => fav.id === showToAdd.id);
      if (!showExists) {
        const newFavourites = [
          ...favourites,
          {
            id: showToAdd.id,
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

  const removeFavourite = async (id) => {
    try {
      await axios.delete(`https://podcast-api.netlify.app/favourites/${id}`);
      setFavourites(favourites.filter((favourite) => favourite.id !== id));
      // Update localStorage after removing the favorite
      localStorage.setItem(
        "favorites",
        JSON.stringify(favourites.filter((favourite) => favourite.id !== id))
      );
      // Check if the selected show is being removed, if so, reset selectedShow to null
      if (selectedShow && selectedShow.id === id) {
        setSelectedShow(null);
      }
    } catch (error) {
      console.error("Error removing favourite:", error);
    }
  };

  const sortByShowAZ = () => {
    setFavourites([...favourites.sort((a, b) => a.show.localeCompare(b.show))]);
  };

  const sortByShowZA = () => {
    setFavourites([...favourites.sort((a, b) => b.show.localeCompare(a.show))]);
  };

  const sortByDateAsc = () => {
    setFavourites([
      ...favourites.sort(
        (a, b) => new Date(a.dateTimeAdded) - new Date(b.dateTimeAdded)
      ),
    ]);
  };

  const sortByDateDesc = () => {
    setFavourites([
      ...favourites.sort(
        (a, b) => new Date(b.dateTimeAdded) - new Date(a.dateTimeAdded)
      ),
    ]);
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
      {favourites.map((favourite) => (
        <div key={favourite.id}>
          <p>
            {favourite.show} - Season {favourite.season}, Episode:{" "}
            {favourite.episode}
          </p>
          <img
            src={favourite.image}
            alt={favourite.show}
            style={{ width: "200px" }}
          />
          <p>
            Date and Time Added: {new Date(favourite.dateTimeAdded).toString()}
          </p>
          <IconButton
            onClick={() => removeFavourite(favourite.id)} // Call removeFavourite function with the ID of the selected show
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
