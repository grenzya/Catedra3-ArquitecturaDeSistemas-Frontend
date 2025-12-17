import React, { FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Agent from "../../app/api/agent";
import { useContext, useState } from "react";
import { AuthContext } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import useMediaQuery from "@mui/material/useMediaQuery";
import GenerateTabTitle from "../../app/utils/TitleGenerator";
import { LoadingButton } from "@mui/lab";
import Colors from "../../app/static/colors";
import Regex from "../../app/utils/Regex";
import { LoginUser } from "../../app/models/LoginUser";

const defaultTheme = createTheme();

const LogIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { setAuthenticated, setUsername } = useContext(AuthContext);
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const navigate = useNavigate();

  document.title = GenerateTabTitle("Iniciar Sesión");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const Email: string = data.get("email")?.toString() ?? "";
    const Password: string = data.get("password")?.toString() ?? "";
    sendData(Email, Password);
  };

  const handleSuccessfullyLogin = (data: LoginUser) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.name);

    setAuthenticated(true);
    setUsername(data.name);
    navigate("/");
  };

  const handleFieldChange = (event: any) => {
    if (error) setError(false);
  };

  const sendData = (email: string, password: string) => {
    if (!Regex.emailRegex.test(email) || !Regex.pwdRegex.test(password)) {
      setError(true);
      return;
    }
    setLoading(true);
    Agent.Auth.login({ email, password })
      .then(handleSuccessfullyLogin)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  return (
    <Grid data-testing="LogIn" className="s">
      <Paper
        style={{
          backgroundImage: "url(/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <ThemeProvider theme={defaultTheme}>
          <Container
            component="main"
            maxWidth="md"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                mt: 3,
                border: Colors.black,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                height: "100%",
                width: isMobile ? "100%" : 450,
                mb: 3,
                backgroundColor: Colors.secondaryWhite,
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                className="font-title"
                sx={{ marginBottom: 1, mt: 3, fontSize: 30 }}
              >
                INICIAR SESIÓN
              </Typography>
              <Grid container spacing={1.1} justifyContent="flex-end">
                <Grid item xs={12}>
                  {error && (
                    <Fade in={error}>
                      <Alert
                        severity="error"
                        sx={{
                          width: "89%",
                          ml: 3,
                          mr: 3,
                          textAlign: "center",
                        }}
                      >
                        Credenciales incorrectas
                      </Alert>
                    </Fade>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    id="email"
                    label="Correo electrónico"
                    name="email"
                    variant="filled"
                    onChange={handleFieldChange}
                    autoComplete="email"
                    size="small"
                    InputLabelProps={{
                      sx: {
                        fontSize: "14px",
                        fontFamily: "Raleway",
                      },
                    }}
                    sx={{
                      width: "89%",
                      ml: 3,
                      mr: 3,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    onChange={handleFieldChange}
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="password"
                    size="small"
                    variant="filled"
                    InputLabelProps={{
                      sx: {
                        fontSize: "14px",
                        fontFamily: "Raleway",
                      },
                    }}
                    sx={{
                      width: "89%",
                      ml: 3,
                      mr: 3,
                      mb: 1,
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    textAlign="right"
                  >
                    ¿Eres nuev@?{" "}
                    <Link
                      marginRight={5}
                      href="/register"
                      color="primary"
                      underline="hover"
                      fontWeight="600"
                      style={{ color: Colors.primaryOrange }}
                    >
                      Registrate
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton
                    loading={loading}
                    type="submit"
                    style={{
                      backgroundColor: Colors.primaryBlue,
                      width: "89%",
                      height: 50,
                    }}
                    variant="contained"
                    sx={{
                      mt: 1,
                      ml: 3,
                      mr: 3,
                      fontFamily: "Raleway, sans-serif",
                      fontSize: "20px",
                      fontWeight: 300,
                      textTransform: "none",
                    }}
                  >
                    Ingresar
                  </LoadingButton>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    href="/"
                    type="submit"
                    style={{
                      backgroundColor: Colors.secondaryWhite,
                      width: "89%",
                      height: 50,
                      border: "1px solid " + Colors.primaryBlue,
                      color: Colors.primaryBlue,
                    }}
                    variant="contained"
                    sx={{
                      ml: 3,
                      mr: 3,
                      mb: 3,
                      fontFamily: "Raleway, sans-serif",
                      fontSize: "20px",
                      fontWeight: 300,
                      textTransform: "none",
                    }}
                  >
                    Invitado
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </ThemeProvider>
      </Paper>
    </Grid>
  );
};

export default LogIn;
