import * as React from "react";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Agent from "../../app/api/agent";
import { useState, useEffect, useContext, FormEvent } from "react";
import { AuthContext } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { startCase } from "lodash";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import { LoadingButton } from "@mui/lab";
import Colors from "../../app/static/colors";
import { CircularProgress, useMediaQuery } from "@mui/material";
import Regex from "../../app/utils/Regex";
import { ApiMessages, Messages } from "../../app/utils/Constants";
import { emptyString, translateApiMessages } from "../../app/utils/StringUtils";
import { LoginUser } from "../../app/models/LoginUser";

const styles = {
  paper: {
    backgroundImage: "url(/background.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: "100vw",
  },
  form: {
    mt: 3,
    border: Colors.black,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
    height: "100%",
    width: "100%",
    mb: 3,
    backgroundColor: Colors.secondaryWhite,
  },
  alert: {
    width: "89.5%",
    ml: 3,
    mr: 3,
    mb: 1,
    textAlign: "center",
  },
};

const defaultTheme = createTheme();

export default function SignUp() {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const { setAuthenticated, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState<string>(emptyString);
  const [validName, setValidName] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>(emptyString);
  const [validFirstName, setValidFirstName] = useState<boolean>(false);

  const [lastName, setLastName] = useState<string>(emptyString);
  const [validLastName, setValidLastName] = useState<boolean>(false);

  const [email, setEmail] = useState<string>(emptyString);
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [rut, setRut] = useState<string>(emptyString);
  const [validRut, setValidRut] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>(emptyString);
  const [validPwd, setValidPwd] = useState<boolean>(false);

  const [matchPwd, setMatchPwd] = useState<string>(emptyString);
  const [validMatch, setValidMatch] = useState<boolean>(false);

  const [career, setCareer] = useState<string>(emptyString);
  const [careers, setCareers] = useState([]);

  const [checked, setChecked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(emptyString);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    Agent.requests
      .get("Careers")
      .then((response) => setCareers(response))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setValidPwd(Regex.pwdRegex.test(pwd));
    setValidMatch(pwd === matchPwd);
    setValidRut(Regex.rutRegex.test(rut));
    setValidName(Regex.nameRegex.test(name));
    setValidFirstName(Regex.lastNameRegex.test(firstName));
    setValidLastName(Regex.lastNameRegex.test(lastName));
    setValidEmail(Regex.emailRegex.test(email));
  }, [email, firstName, lastName, matchPwd, name, pwd, rut]);

  const handleSuccessfullyLogin = (data: LoginUser) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.name);

    setAuthenticated(true);
    setUsername(data.name);
    navigate("/");
  };

  const handleCatchApiErrors = (err: any) => {
    let translatedError: string = translateApiMessages(
      ApiMessages.defaultErrorMsg
    );
    const errorDetail = err.response.data?.detail;
    const rutError = err?.response?.data?.errors?.RUT[0];

    if (errorDetail) {
      translatedError = translateApiMessages(errorDetail);
    } else if (rutError) {
      translatedError = translateApiMessages(rutError);
    }

    setErrorMessage(translatedError);
    setChecked(true);
  };

  const sendData = (user: any) => {
    setIsSubmitting(true);
    Agent.Auth.register(user)
      .then(handleSuccessfullyLogin)
      .catch(handleCatchApiErrors)
      .finally(() => setIsSubmitting(false));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name: string = data.get("name")?.toString() ?? emptyString;
    const FirstLastName: string =
      data.get("firstName")?.toString() ?? emptyString;
    const SecondLastName: string =
      data.get("lastName")?.toString() ?? emptyString;
    const RUT: string = data.get("rut")?.toString() ?? emptyString;
    const CareerId: number = parseInt(
      data.get("career")?.toString() ?? emptyString
    );
    const email: string = data.get("email")?.toString() ?? emptyString;
    const Password: string = data.get("password")?.toString() ?? emptyString;
    const RepeatedPassword: string =
      data.get("repeatPassword")?.toString() ?? emptyString;

    sendData({
      name,
      FirstLastName,
      SecondLastName,
      RUT,
      CareerId,
      email,
      Password,
      RepeatedPassword,
    });
  };

  if (isLoading)
    return (
      <Paper style={styles.paper}>
        <Container
          component="main"
          maxWidth="md"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: 0,
          }}
        >
          <CircularProgress
            size={90}
            sx={{
              color: Colors.primaryOrange,
              marginBottom: "2rem",
            }}
          />
          <Typography
            variant="h4"
            component="h3"
            sx={{
              color: Colors.primaryOrange,
            }}
          >
            Cargando...
          </Typography>
        </Container>
      </Paper>
    );

  return (
    <Paper style={styles.paper}>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 0,
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            ...styles.form,
            width: isSmallScreen ? "100%" : "50%",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            className="font-title"
            sx={{
              marginBottom: 1,
              mt: 3,
              fontSize: "2rem",
              [defaultTheme.breakpoints.down("md")]: {
                fontSize: "1.5rem",
              },
              [defaultTheme.breakpoints.down("sm")]: {
                fontSize: "1rem",
              },
            }}
          >
            REGÍSTRATE
          </Typography>

          <Grid container spacing={1.1} justifyContent="flex-end">
            <Grid item xs={12} container>
              {checked && (
                <Fade in={checked}>
                  <Alert severity="error" sx={styles.alert}>
                    {errorMessage}
                  </Alert>
                </Fade>
              )}
              <TextField
                helperText={
                  !validName && name.trim() !== emptyString
                    ? Messages.nameErrorMsg
                    : emptyString
                }
                aria-describedby="namenote"
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => {
                  setName(e.target.value);
                  setChecked(false);
                }}
                aria-invalid={validName && name.trim() !== emptyString}
                value={name}
                error={!validName && name.trim() !== emptyString}
                variant="filled"
                id="name"
                label="Nombre"
                name="name"
                required
                autoComplete="off"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow:
                    validName || !name
                      ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                      : "none",
                }}
              />
            </Grid>
            <Grid item xs={12} md={12} spacing={1.1} container>
              <Grid item xs={6} md={6} container>
                <TextField
                  helperText={
                    !validFirstName && firstName.trim() !== emptyString
                      ? Messages.lastNameErrorMsg
                      : emptyString
                  }
                  aria-describedby="flNote"
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setFirstName(e.target.value)}
                  aria-invalid={
                    validFirstName && firstName.trim() !== emptyString
                  }
                  value={firstName}
                  error={!validFirstName && firstName.trim() !== emptyString}
                  autoComplete="off"
                  name="firstName"
                  required
                  variant="filled"
                  id="firstName"
                  label="Primer Apellido"
                  size="small"
                  InputLabelProps={{
                    sx: {
                      fontSize: "14px",
                      fontFamily: "Raleway",
                      width: "100%",
                    },
                  }}
                  sx={{
                    ml: 3,
                    boxShadow:
                      (validFirstName || !firstName) &&
                      (validLastName || !lastName)
                        ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                        : "none",
                  }}
                />
              </Grid>
              <Grid item xs={6} md={6} container>
                <TextField
                  helperText={
                    !validLastName && lastName.trim() !== emptyString
                      ? Messages.lastNameErrorMsg
                      : emptyString
                  }
                  required
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setLastName(e.target.value)}
                  aria-invalid={
                    validLastName && lastName.trim() !== emptyString
                  }
                  value={lastName}
                  error={!validLastName && lastName.trim() !== emptyString}
                  aria-describedby="flNote"
                  id="lastName"
                  variant="filled"
                  label="Segundo Apellido"
                  name="lastName"
                  autoComplete="off"
                  size="small"
                  InputLabelProps={{
                    sx: {
                      fontSize: "14px",
                      fontFamily: "Raleway",
                      width: "100%",
                    },
                  }}
                  sx={{
                    mr: 3,
                    boxShadow:
                      (validLastName || !lastName) &&
                      (validFirstName || !firstName)
                        ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                        : "none",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <TextField
                helperText={
                  !validRut && rut.trim() !== emptyString
                    ? Messages.rutErrorMsg
                    : emptyString
                }
                required
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setRut(e.target.value)}
                aria-invalid={validRut && rut.trim() !== emptyString}
                value={rut}
                error={!validRut && rut.trim() !== emptyString}
                aria-describedby="rutnote"
                variant="filled"
                id="rut"
                label="RUT"
                name="rut"
                autoComplete="rut"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow:
                    validRut || !rut
                      ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                      : "none",
                }}
              />
            </Grid>
            <Grid item xs={12} container>
              <TextField
                helperText={
                  !validEmail && email.trim() !== emptyString
                    ? Messages.emailErrorMsg
                    : emptyString
                }
                error={!validEmail && email.trim() !== emptyString}
                aria-invalid={validEmail && email.trim() !== emptyString}
                value={email}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setEmail(e.target.value)}
                required
                id="email"
                label="Correo electrónico"
                name="email"
                variant="filled"
                autoComplete="off"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow:
                    validEmail || !email
                      ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                      : "none",
                }}
              />
            </Grid>
            <Grid item xs={12} container>
              <TextField
                required
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setCareer(e.target.value)}
                value={career}
                id="career"
                select
                label="Carrera"
                name="career"
                size="small"
                variant="filled"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                {careers.map((career, index) => (
                  <MenuItem key={index} value={career["id"]}>
                    {startCase(career["name"])}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} container>
              <TextField
                helperText={
                  !validPwd && pwd.trim() !== emptyString
                    ? Messages.pwdErrorMsg
                    : emptyString
                }
                required
                fullWidth
                aria-invalid={validPwd && pwd.trim() !== emptyString}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setPwd(e.target.value)}
                value={pwd}
                error={!validPwd && pwd.trim() !== emptyString}
                aria-describedby="pwdnote"
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="new-password"
                size="small"
                variant="filled"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow:
                    validPwd || !pwd
                      ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                      : "none",
                }}
              />
            </Grid>
            <Grid item xs={12} container>
              <TextField
                helperText={
                  !validMatch && matchPwd.trim() !== emptyString
                    ? Messages.matchPwdErrorMsg
                    : emptyString
                }
                required
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setMatchPwd(e.target.value)}
                aria-invalid={validMatch && matchPwd.trim() !== emptyString}
                value={matchPwd}
                error={!validMatch && matchPwd.trim() !== emptyString}
                type="password"
                id="repeatPassword"
                label="Repetir contraseña"
                name="repeatPassword"
                autoComplete="RepeatPassword"
                size="small"
                variant="filled"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mb: 1,
                  mr: 3,
                  boxShadow:
                    validMatch || !matchPwd
                      ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                      : "none",
                }}
              />
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                color="textPrimary"
                textAlign="right"
                sx={{
                  [defaultTheme.breakpoints.down("md")]: {
                    fontSize: "0.8rem",
                  },
                  [defaultTheme.breakpoints.down("sm")]: {
                    fontSize: "0.7rem",
                    ml: 3,
                    mr: 3,
                  },
                }}
              >
                ¿Ya tienes cuenta?{" "}
                <Link
                  marginRight={3}
                  href="/login"
                  color="primary"
                  underline="hover"
                  fontWeight="600"
                  style={{ color: Colors.primaryOrange }}
                >
                  Inicia Sesión
                </Link>
              </Typography>
            </Grid>
          </Grid>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            style={{
              backgroundColor: Colors.primaryBlue,
              width: "89%",
              height: 50,
            }}
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              fontFamily: "Raleway, sans-serif",
              fontSize: "20px",
              fontWeight: 300,
              textTransform: "none",
            }}
            disabled={
              !validPwd ||
              !validMatch ||
              !validRut ||
              !validName ||
              !validFirstName ||
              !validLastName ||
              !validEmail
                ? true
                : false
            }
          >
            Registrarme
          </LoadingButton>
        </Box>
      </Container>
    </Paper>
  );
}
