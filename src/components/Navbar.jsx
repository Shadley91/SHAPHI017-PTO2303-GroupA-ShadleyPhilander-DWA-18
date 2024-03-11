export default function Navbar() {
  return (
    <nav>
      <img src="./src/images/morpheus.png" className="nav--logo" />
      <h2>Podcast Pharmacy</h2>
      <h2>
        <p>Get your daily dose!</p>
      </h2>
      <button className="browse--btn">Browse</button>
      <button className="favourites--btn">Favourites</button>
      <button className="search--btn">Search</button>
    </nav>
  );
}
