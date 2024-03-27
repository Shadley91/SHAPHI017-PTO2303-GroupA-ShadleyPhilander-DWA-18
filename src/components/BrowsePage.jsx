import { useState, useEffect, useMemo, useCallback } from "react";
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

  // Fetch shows and their seasons count on component mount
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");
        const data = await response.json();
        // Set shows and filteredShows states with fetched data
        setShows(data);
        setFilteredShows(data);
        // Fetch seasons count for each show
        const showsWithSeasons = await Promise.all(
          data.map(async (show) => {
            const seasonResponse = await fetch(
              `https://podcast-api.netlify.app/id/${show.id}`
            );
            const seasonData = await seasonResponse.json();
            return { ...show, seasons: seasonData.seasons.length };
          })
        );
        // Update shows and filteredShows states with seasons count
        setShows(showsWithSeasons);
        setFilteredShows(showsWithSeasons);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchShows();
  }, []);

  const genreMap = useMemo(
    () => ({
      1: "Personal Growth",
      2: "True Crime and Investigative Journalism",
      3: "History",
      4: "Comedy",
      5: "Entertainment",
      6: "Business",
      7: "Fiction",
      8: "News",
      9: "Kids and Family",
    }),
    []
  );

  const handleBackButton = () => {
    Navigate("/");
  };

  const handleSortChange = useCallback(
    (sortBy) => {
      setSortBy(sortBy);
      // Use a stable sorting algorithm to avoid unnecessary re-renders
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
      // Update filteredShows state with sorted shows
      setFilteredShows(sortedShows);
    },
    [filteredShows]
  );

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value.toLowerCase());
  }, []);

  // Debounce search input to avoid frequent filtering
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const filtered = shows.filter((show) =>
        show.title.toLowerCase().includes(searchTerm)
      );
      setFilteredShows(filtered);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, shows]);

  const addToFavorites = useCallback((show) => {
    // Use localStorage batch updates to improve performance
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
  }, []);

  const filterByGenre = useCallback(
    (genreId) => {
      setActiveGenre(genreId);
      // Filter shows by genre and update filteredShows state
      if (genreId === null) {
        setFilteredShows(shows);
      } else {
        const filtered = shows.filter((show) => show.genres.includes(genreId));
        setFilteredShows(filtered);
      }
    },
    [shows]
  );

  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(
    () =>
      createTheme({
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
                margin: "0 5px",
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
      }),
    []
  );

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
            sx={{ color: "white" }}
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
                sx={{ margin: "0 5px" }}
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
              <p> Seasons: {show.seasons}</p>{" "}
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
