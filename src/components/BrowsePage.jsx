import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Button,
  IconButton,
  createTheme,
  ThemeProvider,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BrowsePage = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGenre, setActiveGenre] = useState(null);

  const Navigate = useNavigate();
  const handleBackButton = () => {
    Navigate("/");
  };

  useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((response) => response.json())
      .then((data) => {
        setShows(data);
        setFilteredShows(data);
      })
      .catch((error) => console.error("Error fetching shows:", error));
  }, []);

  const genreMap = {
    1: "Personal Growth",
    2: "True Crime and Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
  };

  const handleSortChange = (sortBy) => {
    setSortBy(sortBy);
    const sortedShows = [...filteredShows].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "-title") {
        return b.title.localeCompare(a.title);
      } else if (sortBy === "lastUpdated") {
        return (
          moment(a.lastUpdated).valueOf() - moment(b.lastUpdated).valueOf()
        );
      } else if (sortBy === "-lastUpdated") {
        return (
          moment(b.lastUpdated).valueOf() - moment(a.lastUpdated).valueOf()
        );
      }
    });
    setFilteredShows(sortedShows);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    const filtered = shows.filter((show) =>
      show.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredShows(filtered);
  };

  const addToFavorites = (show) => {
    const existingFavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];
    const isAlreadyFavorite = existingFavorites.some(
      (favorite) => favorite.id === show.id
    );

    if (!isAlreadyFavorite) {
      const newFavorites = [...existingFavorites, show];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      console.log("Favorites after adding:", newFavorites);
    }
  };

  const filterByGenre = (genreId) => {
    setActiveGenre(genreId);
    if (genreId === null) {
      setFilteredShows(shows);
    } else {
      const filtered = shows.filter((show) => show.genres.includes(genreId));
      setFilteredShows(filtered);
    }
  };

  useEffect(() => {
    const fetchSeasonsCount = async () => {
      const showsWithSeasons = await Promise.all(
        shows.map(async (show) => {
          const response = await fetch(
            `https://podcast-api.netlify.app/id/${show.id}`
          );
          const data = await response.json();
          return {
            ...show,
            seasons: data.seasons.length, // Extract season count
            selectedSeason: 1, // Initialize selectedSeason to 1
          };
        })
      );
      setShows(showsWithSeasons);
      setFilteredShows(showsWithSeasons);
    };

    fetchSeasonsCount();
  }, [shows]);

  // Define a custom theme for Material-UI with Roboto font
  const theme = createTheme({
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)",
            },
            margin: "0 5px", // Added margin for spacing
          },
        },
        variants: {
          outlined: {
            color: "white",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            color: "white",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "black",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <IconButton onClick={handleBackButton} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <h1>Browse Shows</h1>
        <div>
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            sx={{ color: "white" }} // Changing text color to white
          >
            <MenuItem value="title">Sort by Title (A-Z)</MenuItem>
            <MenuItem value="-title">Sort by Title (Z-A)</MenuItem>
            <MenuItem value="lastUpdated">
              Sort by Date Updated (Ascending)
            </MenuItem>
            <MenuItem value="-lastUpdated">
              Sort by Date Updated (Descending)
            </MenuItem>
          </Select>
        </div>
        <div>
          <div>
            <Button
              variant="text"
              color="primary"
              onClick={() => filterByGenre(null)}
              className={activeGenre === null ? "active" : ""}
            >
              All
            </Button>
            {Object.entries(genreMap).map(([id, name]) => (
              <Button
                key={id}
                variant="text"
                color="primary"
                onClick={() => filterByGenre(parseInt(id))}
                className={activeGenre === parseInt(id) ? "active" : ""}
                sx={{ margin: "0 5px" }} // Adding spacing between buttons
              >
                <Typography variant="button">{name}</Typography>
              </Button>
            ))}
          </div>
          {filteredShows.map((show) => (
            <div key={show.id}>
              <img
                src={show.image}
                alt={show.name}
                style={{ maxWidth: "200px" }}
              />
              <h2>{show.title}</h2>
              {show.seasons > 1 && (
                <div>
                  <label htmlFor={`season-dropdown-${show.id}`}>
                    Select Season:
                  </label>
                  <Select
                    id={`season-dropdown-${show.id}`}
                    value={show.selectedSeason || 1}
                    onChange={(e) => {
                      const selectedSeason = parseInt(e.target.value);
                      const updatedShows = filteredShows.map((s) =>
                        s.id === show.id ? { ...s, selectedSeason } : s
                      );
                      setFilteredShows(updatedShows);
                    }}
                  >
                    {[...Array(show.seasons).keys()].map((season) => (
                      <MenuItem key={season + 1} value={season + 1}>
                        Season {season + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  <span style={{ marginLeft: "8px" }}>
                    Selected: Season {show.selectedSeason || 1}
                  </span>
                </div>
              )}
              <p>Seasons: {show.seasons}</p>{" "}
              <p>Last Updated: {moment(show.lastUpdated).format("LL")}</p>
              <p>
                Genres:{" "}
                {show.genres.map((genreId) => genreMap[genreId]).join(", ")}
              </p>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => addToFavorites(show)}
              >
                Add to Favorites
              </Button>
            </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default BrowsePage;
