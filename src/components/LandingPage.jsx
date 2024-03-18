import { useState, useEffect } from "react";

function LandingPage() {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [loadingNewData, setLoadingNewData] = useState(false);

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
          }))
        );
        setLoadingInitialData(false);
      })
      .catch((error) => console.error("Error fetching shows:", error));
  }, []);

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
          seasons: data.seasons,
          episodes: data.episodes,
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
          <li key={show.id} onClick={() => fetchShowData(show.id)}>
            <div>
              <h3>{show.name}</h3>
              <p>{show.description}</p>
              <img
                src={show.image}
                alt={show.name}
                style={{ maxWidth: "200px" }}
              />
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
          {/* Render additional details of the selected show */}
          <h3>Seasons</h3>
          <ul>
            {selectedShow.seasons.map((season) => (
              <li key={season.id}>{season.name}</li>
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
