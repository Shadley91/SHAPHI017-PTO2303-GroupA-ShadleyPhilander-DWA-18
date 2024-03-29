import { useState, useEffect, useMemo } from "react";
import Button from "@mui/material/Button";

function LandingPage() {
  // State variables to manage data and loading states
  const [shows, setShows] = useState([]); // Stores fetched shows data
  const [selectedShow, setSelectedShow] = useState(null); // Stores data of the selected show
  const [loadingInitialData, setLoadingInitialData] = useState(true); // Indicates whether initial data is being loaded
  const [loadingNewData, setLoadingNewData] = useState(false); // Indicates whether new data is being loaded
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page for pagination
  const [perPage] = useState(5); // Number of items per page

  // Mapping of genre IDs to genre names, memoized for optimization
  const genreMapping = useMemo(
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

  // Fetches initial shows data when component mounts or genre mapping changes
  useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((response) => response.json())
      .then((data) => {
        setShows(
          data.map((preview) => ({
            id: preview.id,
            name: preview.title,
            image: preview.image,
            description: preview.description,
            genres: preview.genres.map((genreId) => genreMapping[genreId]),
          }))
        );
        setLoadingInitialData(false);
      })
      .catch((error) => console.error("Error fetching shows:", error));
  }, [genreMapping]);

  // Fetches detailed data of a selected show
  const fetchShowData = (showId) => {
    setLoadingNewData(true);
    fetch(`https://podcast-api.netlify.app/id/${showId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedShow({
          id: data.id,
          name: data.title,
          image: data.image,
          description: data.description,
          seasons: data.seasons.sort((a, b) => a.number - b.number),
          episodes: data.episodes,
          genres: data.genres.map((genreId) => genreMapping[genreId]),
        });
        setLoadingNewData(false);
      })
      .catch((error) =>
        console.error(`Error fetching show ${showId} data:`, error)
      );
  };

  // Logic for pagination
  const indexOfLastShow = currentPage * perPage;
  const indexOfFirstShow = indexOfLastShow - perPage;
  const currentShows = shows.slice(indexOfFirstShow, indexOfLastShow);

  // Changes the current page for pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Renders loading message when initial data is being fetched
  if (loadingInitialData) {
    return <div>Loading initial data...</div>;
  }

  // Renders the landing page with shows and pagination
  return (
    <div>
      <h1>All Shows</h1>
      <ul>
        {/* Maps through current shows to render show previews */}
        {currentShows.map((show) => (
          <li key={show.id}>
            <div>
              <h3>{show.name}</h3>
              <p>{show.description}</p>
              <p>Genres: {show.genres.join(", ")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={show.image}
                  alt={show.name}
                  style={{ maxWidth: "200px" }}
                />
                {/* Button to view detailed information of the show */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchShowData(show.id)}
                  style={{ marginLeft: "10px" }}
                >
                  View
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
      >
        {/* Button for previous page */}
        <Button
          variant="contained"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
          style={{ marginRight: "10px" }}
        >
          Previous
        </Button>
        {/* Button for next page */}
        <Button
          variant="contained"
          disabled={indexOfLastShow >= shows.length}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Renders loading message when new data is being fetched */}
      {loadingNewData && <div>Loading new data...</div>}

      {/* Renders detailed information of the selected show */}
      {selectedShow && (
        <div>
          <h2>{selectedShow.name}</h2>
          <img
            src={selectedShow.image}
            alt={selectedShow.name}
            style={{ maxWidth: "200px" }}
          />
          <p>{selectedShow.description}</p>
          <p>Genres: {selectedShow.genres.join(", ")}</p>
          <h3>Seasons</h3>
          <ul>
            {/* Lists seasons of the selected show */}
            {selectedShow.seasons.map((season, index) => (
              <li key={season.id}>
                Season {index + 1}: {season.name}
              </li>
            ))}
          </ul>
          <h3>Episodes</h3>
          <ul>
            {/* Lists episodes of the selected show */}
            {selectedShow.episodes.map((episode) => (
              <li key={episode.id}>{episode.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
