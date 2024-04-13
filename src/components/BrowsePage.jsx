import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [selectedSeasons, setSelectedSeasons] = useState({});
  const [seasonEpisodes, setSeasonEpisodes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");
        const data = await response.json();

        const showsWithSeasons = await Promise.all(
          data.map(async (show) => {
            const seasonResponse = await fetch(
              `https://podcast-api.netlify.app/id/${show.id}`
            );
            const seasonData = await seasonResponse.json();
            const lastUpdated = moment().toISOString();
            return { ...show, seasons: seasonData.seasons, lastUpdated };
          })
        );

        setShows(showsWithSeasons);
        setFilteredShows(showsWithSeasons);

        const initialSelectedSeasons = {};
        const initialSeasonEpisodes = {};

        showsWithSeasons.forEach((show) => {
          initialSelectedSeasons[show.id] = 1;
          initialSeasonEpisodes[show.id] = show.seasons[0].episodes.length;
        });

        setSelectedSeasons(initialSelectedSeasons);
        setSeasonEpisodes(initialSeasonEpisodes);
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
    navigate("/");
  };

  const handleSortChange = useCallback(
    (sortBy) => {
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
        return 0;
      });
      setFilteredShows(sortedShows);
    },
    [filteredShows]
  );

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value.toLowerCase());
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const filtered = shows.filter((show) =>
        show.title.toLowerCase().includes(searchTerm)
      );
      setFilteredShows(filtered);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, shows]);

  const addToFavorites = useCallback(
    (show) => {
      navigate("/favourites", { state: { show } });
    },
    [navigate]
  );

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

  const handleSeasonChange = useCallback(
    (showId, selectedSeason) => {
      setSelectedSeasons({
        ...selectedSeasons,
        [showId]: selectedSeason,
      });

      const selectedShow = shows.find((show) => show.id === showId);
      const episodesCount =
        selectedShow.seasons[selectedSeason - 1].episodes.length;
      setSeasonEpisodes({
        ...seasonEpisodes,
        [showId]: episodesCount,
      });
    },
    [selectedSeasons, seasonEpisodes, shows]
  );

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

  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredShows.slice(indexOfFirstShow, indexOfLastShow);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

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
          {currentShows.map((show) => (
            <div key={show.id}>
              <img
                src={show.image}
                alt={show.title}
                style={{ maxWidth: "200px" }}
              />
              <h2>{show.title}</h2>
              <p>Seasons: {show.seasons.length}</p>
              <Select
                value={selectedSeasons[show.id] || 1}
                onChange={(e) =>
                  handleSeasonChange(show.id, parseInt(e.target.value))
                }
              >
                {show.seasons.map((season, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    Season {index + 1}
                  </MenuItem>
                ))}
              </Select>
              <p>Selected Season: {selectedSeasons[show.id] || 1}</p>
              <p>Episodes in Selected Season: {seasonEpisodes[show.id]}</p>
              <ul>
                {show.seasons[selectedSeasons[show.id] - 1].episodes.map(
                  (episode, index) => (
                    <li key={index}>
                      Episode {index + 1}: {episode.title}
                    </li>
                  )
                )}
              </ul>
              <p>Last Updated: {moment(show.lastUpdated).format("LLL")}</p>
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

export default BrowsePage;
