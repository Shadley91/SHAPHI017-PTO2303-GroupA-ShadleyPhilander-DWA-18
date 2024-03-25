import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BrowsePage = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");

  const Navigate = useNavigate();
  const handleBackButton = () => {
    Navigate("/");
  };

  useEffect(() => {
    // Fetch data from the API
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
      } else if (sortBy === "lastUpdated") {
        return new Date(a.lastUpdated) - new Date(b.lastUpdated);
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

  return (
    <div>
      <button onClick={handleBackButton}>Back</button>
      <h1>Browse Shows</h1>
      <div>
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="title">Sort by Title (A-Z)</option>
          <option value="-title">Sort by Title (Z-A)</option>
          <option value="lastUpdated">Sort by Date Updated (Ascending)</option>
          <option value="-lastUpdated">
            Sort by Date Updated (Descending)
          </option>
        </select>
      </div>
      <div>
        {filteredShows.map((show) => (
          <div key={show.id}>
            <img
              src={show.image}
              alt={show.name}
              style={{ maxWidth: "200px" }}
            />
            <h2>{show.title}</h2>
            <p>Seasons: {show.seasons.length}</p>{" "}
            {/* Display number of seasons */}
            <p>
              Last Updated: {new Date(show.lastUpdated).toLocaleDateString()}
            </p>
            <p>
              Genres:{" "}
              {show.genres.map((genreId) => genreMap[genreId]).join(", ")}
            </p>
            {/* Add other show details and functionalities */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;
