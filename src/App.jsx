// import AudioPlayer from "./components/AudioPlayer";
import BrowsePage from "./components/BrowsePage";
import FavouritesPage from "./components/FavouritesPage";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
// import Loading from "./components/Loading";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        {/* <AudioPlayer />  */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<LandingPage />} />
            <Route path="/browse/:id" element={<BrowsePage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
