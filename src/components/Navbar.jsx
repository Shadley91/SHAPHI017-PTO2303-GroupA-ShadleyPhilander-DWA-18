import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const handleBrowsingPage = () => {
    navigate("/browse/:id");
  };
  const handleFavouritesPage = () => {
    navigate("/favourites");
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="logo">
          <MicIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Podcast App
        </Typography>
        <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit" onClick={handleBrowsingPage}>
            Browse
          </Button>
          <Button color="inherit" onClick={handleFavouritesPage}>
            Favourites
          </Button>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
          >
            <SearchIcon />
          </IconButton>
          <Button color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
