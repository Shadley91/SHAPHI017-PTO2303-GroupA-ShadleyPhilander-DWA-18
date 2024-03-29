import {
  AppBar, // Material-UI component for the top app bar
  IconButton, // Material-UI component for an icon button
  Toolbar, // Material-UI component for a toolbar
  Typography, // Material-UI component for typography
  Box, // Material-UI component for a layout box
  Button, // Material-UI component for buttons
} from "@mui/material"; // Importing specific components from Material-UI
import MicIcon from "@mui/icons-material/Mic"; // Importing a microphone icon from Material-UI icons
import SearchIcon from "@mui/icons-material/Search"; // Importing a search icon from Material-UI icons
import { useNavigate } from "react-router-dom"; // Importing hook for navigation from React Router DOM

// Functional component definition for the Navbar
export default function Navbar() {
  const navigate = useNavigate(); // Initializing the useNavigate hook for navigation

  // Function to handle navigation to the browsing page
  const handleBrowsingPage = () => {
    navigate("/browse/:id"); // Navigating to the browsing page with dynamic id
  };

  // Function to handle navigation to the favourites page
  const handleFavouritesPage = () => {
    navigate("/favourites"); // Navigating to the favourites page
  };

  // Rendering the Navbar component
  return (
    <AppBar position="static">
      {" "}
      {/* Static positioning for the app bar */}
      <Toolbar>
        {" "}
        {/* Toolbar for containing the content */}
        <IconButton size="large" edge="start" color="inherit" aria-label="logo">
          {/* Icon button for logo */}
          <MicIcon /> {/* Microphone icon */}
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Typography for displaying the title */}
          Podcast App {/* Title of the app */}
        </Typography>
        <Box>
          {" "}
          {/* Layout box for aligning elements */}
          <Button color="inherit">Home</Button>{" "}
          {/* Button for navigating to the Home page */}
          <Button color="inherit" onClick={handleBrowsingPage}>
            {/* Button for navigating to the Browsing page */}
            Browse
          </Button>
          <Button color="inherit" onClick={handleFavouritesPage}>
            {/* Button for navigating to the Favourites page */}
            Favourites
          </Button>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
          >
            {/* Icon button for search */}
            <SearchIcon /> {/* Search icon */}
          </IconButton>
          <Button color="inherit">Login</Button> {/* Button for login */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
