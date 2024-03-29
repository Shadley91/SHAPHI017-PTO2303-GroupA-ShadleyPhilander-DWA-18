import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // Importing moment library for date handling
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

// BrowsePage component definition
const BrowsePage = () => {
  // States for managing various data
  const [shows, setShows] = useState([]); // State for storing fetched shows data
  const [filteredShows, setFilteredShows] = useState([]); // State for storing filtered shows data
  const [sortBy, setSortBy] = useState("title"); // State for sorting criteria
  const [searchTerm, setSearchTerm] = useState(""); // State for search term input
  const [activeGenre, setActiveGenre] = useState(null); // State for active genre filter
  const [selectedSeasons, setSelectedSeasons] = useState({}); // State for selected seasons per show
  const [seasonEpisodes, setSeasonEpisodes] = useState({}); // State for episodes count per selected season
  const [currentPage, setCurrentPage] = useState(1); // State for current page of pagination
  const [showsPerPage] = useState(5); // State for number of shows per page

  const Navigate = useNavigate(); // Navigation hook for redirecting between pages

  // Effect to fetch shows data from the API on component mount
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");
        const data = await response.json();
        // Fetch seasons data for each show
        const showsWithSeasons = await Promise.all(
          data.map(async (show) => {
            const seasonResponse = await fetch(
              `https://podcast-api.netlify.app/id/${show.id}`
            );
            const seasonData = await seasonResponse.json();
            return { ...show, seasons: seasonData.seasons };
          })
        );
        // Set fetched shows and filtered shows, initialize selected seasons and episodes count states
        setShows(showsWithSeasons);
        setFilteredShows(showsWithSeasons);
        const initialSelectedSeasons = {};
        const initialSeasonEpisodes = {};
        showsWithSeasons.forEach((show) => {
          initialSelectedSeasons[show.id] = 1; // Defaulting to season 1
          initialSeasonEpisodes[show.id] = show.seasons[0].episodes.length; // Defaulting to season 1's episodes count
        });
        setSelectedSeasons(initialSelectedSeasons);
        setSeasonEpisodes(initialSeasonEpisodes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchShows();
  }, []);

  // Memoized genre map for efficient rendering
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

  // Function to handle back button click
  const handleBackButton = () => {
    Navigate("/");
  };

  // Callback function to handle sort criteria change
  const handleSortChange = useCallback(
    (sortBy) => {
      setSortBy(sortBy);
      // Sort filtered shows based on selected criteria
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
    },
    [filteredShows]
  );

  // Callback function to handle search input change
  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value.toLowerCase());
  }, []);

  // Effect to filter shows based on search term
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const filtered = shows.filter((show) =>
        show.title.toLowerCase().includes(searchTerm)
      );
      setFilteredShows(filtered);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, shows]);

  // Callback function to add show to favorites and navigate to favorites page
  const addToFavorites = useCallback(
    (show) => {
      Navigate("/favourites", { state: { show } });
    },
    [Navigate]
  );

  // Callback function to filter shows by genre
  const filterByGenre = useCallback(
    (genreId) => {
      setActiveGenre(genreId);
      if (genreId === null) {
        setFilteredShows(shows);
      } else {
        const filtered = shows.filter((show) => show.genres.includes(genreId));
        setFilteredShows(filtered);
      }
    },
    [shows]
  );

  // Memoized theme object for styling MUI components
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

  // Logic for pagination
  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredShows.slice(indexOfFirstShow, indexOfLastShow);

  // Function to move to next page
  const nextPage = () => setCurrentPage(currentPage + 1);
  // Function to move to previous page
  const prevPage = () => setCurrentPage(currentPage - 1);

  // JSX structure for BrowsePage component
  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Back button */}
        <IconButton onClick={handleBackButton} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <h1>Browse Shows</h1>
        <div>
          {/* Search input and sort select */}
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
          {/* Genre filters */}
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
          {/* Display shows */}
          {currentShows.map((show) => (
            <div key={show.id}>
              <img
                src={show.image}
                alt={show.name}
                style={{ maxWidth: "200px" }}
              />
              <h2>{show.title}</h2>
              <p> Seasons: {show.seasons.length}</p>
              {/* Dropdown for selecting season */}
              <Select
                value={selectedSeasons[show.id] || 1}
                onChange={(e) => {
                  const selectedSeason = parseInt(e.target.value);
                  setSelectedSeasons({
                    ...selectedSeasons,
                    [show.id]: selectedSeason,
                  });
                  console.log(`Season changed to ${selectedSeason}`);
                }}
              >
                {show.seasons.map((season, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    Season {index + 1}
                  </MenuItem>
                ))}
              </Select>
              <p>Selected Season: {selectedSeasons[show.id] || 1}</p>{" "}
              {/* Display selected season */}
              <p>Episodes in Selected Season: {seasonEpisodes[show.id]}</p>
              <p>Last Updated: {moment(show.lastUpdated).format("LL")}</p>
              {/* Display genres */}
              <p>
                Genres:{" "}
                {show.genres.map((genreId) => genreMap[genreId]).join(", ")}
              </p>
              {/* Button to add show to favorites */}
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
        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={prevPage}
            disabled={currentPage === 1}
            variant="outlined"
            color="primary"
          >
            Previous
          </Button>
          <Button
            onClick={nextPage}
            disabled={currentShows.length < showsPerPage}
            variant="outlined"
            color="primary"
          >
            Next
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default BrowsePage; // Exporting BrowsePage component
