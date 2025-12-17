import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
// @ts-ignore
import Cubi12Logo from "../static/images/cubi12.svg";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState, MouseEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import Colors from "../static/colors";

const Navbar = () => {
  const [loggedName, setLoggedName] = useState<string>("");

  const { authenticated, setAuthenticated, setUsername, username } =
    useContext(AuthContext);

  const pages = authenticated
    ? ["Inicio", "Malla Interactiva", "Mi Progreso"]
    : ["Inicio", "Malla Interactiva"];
  const settings = authenticated
    ? [loggedName, "Mis datos", "Cerrar Sesión"]
    : ["Invitado", "Iniciar Sesión", "Registrarse"];

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuthenticated(false);
    setUsername("");
    handleCloseUserMenu();
  };

  // Identify direction
  const identifyDirection = (setting: string) => {
    if (setting === "Iniciar Sesión") return "/login";
    if (setting === "Registrarse") return "/register";
    else if (setting === "Mis datos") return "/edit-profile";
    else if (setting === "Cerrar Sesión") return "/";
    return "#";
  };

  // Identify color menu item
  const identifyColor = (setting: string) => {
    if (setting === "Mis datos") return Colors.primaryBlue;
    else if (setting === "Cerrar Sesión") return Colors.primaryRed;
    return "inherit";
  };

  useEffect(() => {
    if (authenticated) {
      setLoggedName(username ?? "");
    }
  }, [authenticated, username]);

  return (
    <AppBar position="static" sx={{ backgroundColor: Colors.primaryBlue }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/">
            <Avatar
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              alt="Cubi12 Logo"
              src={Cubi12Logo}
            />
          </Link>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 400,
              color: "inherit",
            }}
          >
            CUBI12
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link
                    to={
                      page === "Inicio"
                        ? "/"
                        : page === "Malla Interactiva"
                        ? "/interactive-mesh"
                        : "/my-progress"
                    }
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Avatar
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            alt="Cubi12 Logo"
            src={Cubi12Logo}
          />
          <Box sx={{ flexGrow: 20, display: { xs: "none", md: "flex" } }} />
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link
                key={page}
                style={{ textDecoration: "none", color: "inherit" }}
                to={
                  page === "Inicio"
                    ? "/"
                    : page === "Malla Interactiva"
                    ? "/interactive-mesh"
                    : "/my-progress"
                }
              >
                <Button
                  sx={{ my: 2, color: "white", display: "block" }}
                  onClick={handleCloseNavMenu}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Configuraciones">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={""} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <Link
                  key={setting}
                  style={{
                    textDecoration: "none",
                    color: setting === "Invitado" ? "gray" : "inherit",
                  }}
                  to={identifyDirection(setting)}
                  onClick={() => {
                    if (setting === "Cerrar Sesión") {
                      handleLogout();
                    }
                  }}
                >
                  <MenuItem
                    key={setting}
                    onClick={handleCloseUserMenu}
                    disabled={
                      setting !== "Iniciar Sesión" &&
                      setting !== "Cerrar Sesión" &&
                      setting !== "Mis datos" &&
                      setting !== "Registrarse"
                    }
                  >
                    <Typography
                      key={setting}
                      style={{
                        color: identifyColor(setting),
                        textAlign: "center",
                      }}
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
