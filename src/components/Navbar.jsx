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

export default function Navbar() {
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
          <Button color="inherit">Browse</Button>
          <Button color="inherit">Favourites</Button>

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
