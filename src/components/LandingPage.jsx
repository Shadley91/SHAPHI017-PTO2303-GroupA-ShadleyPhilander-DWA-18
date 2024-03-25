import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [loadingNewData, setLoadingNewData] = useState(false);

  // const navigate = useNavigate();

  // Memoized genre mapping
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

  // Fetch all shows
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
            genres: preview.genres.map((genreId) => genreMapping[genreId]), // Map genre IDs to titles
          }))
        );
        setLoadingInitialData(false);
      })
      .catch((error) => console.error("Error fetching shows:", error));
  }, [genreMapping]);

  // Function to fetch data for a specific show
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
          seasons: data.seasons.sort((a, b) => a.number - b.number), // Sort seasons by number
          episodes: data.episodes,
          genres: data.genres.map((genreId) => genreMapping[genreId]), // Map genre IDs to titles
        });
        setLoadingNewData(false);
      })
      .catch((error) =>
        console.error(`Error fetching show ${showId} data:`, error)
      );
  };

  // Render loading state while initial data is being loaded
  if (loadingInitialData) {
    return <div>Loading initial data...</div>;
  }

  return (
    <div>
      <h1>All Shows</h1>
      <ul>
        {shows.map((show) => (
          <li key={show.id}>
            <div>
              <h3>{show.name}</h3>
              <p>{show.description}</p>
              <p>Genres: {show.genres.join(", ")}</p>
              <img
                src={show.image}
                alt={show.name}
                style={{ maxWidth: "200px" }}
              />
              <button onClick={() => fetchShowData(show.id)}>View</button>
            </div>
          </li>
        ))}
      </ul>

      {loadingNewData && <div>Loading new data...</div>}

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
          {/* Render additional details of the selected show */}
          <h3>Seasons</h3>
          <ul>
            {selectedShow.seasons.map((season, index) => (
              <li key={season.id}>
                Season {index + 1}: {season.name}
              </li>
            ))}
          </ul>
          <h3>Episodes</h3>
          <ul>
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
