import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import "./style.css";

export default function App() {
  return (
    <div className="container">
      <Navbar />
      <LandingPage />
    </div>
  );
}
