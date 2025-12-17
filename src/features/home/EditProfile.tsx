import React from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SyntheticEvent, useRef, useState, useEffect, useContext } from "react";
import Agent from "../../app/api/agent";
import { startCase } from "lodash";
import { AuthContext } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Colors from "../../app/static/colors";
import GenerateTabTitle from "../../app/utils/TitleGenerator";
import { emptyString } from "../../app/utils/StringUtils";
import LoadingSpinner from "../../app/layout/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiMessages } from "../../app/utils/Constants";
import Regex from "../../app/utils/Regex";
import { User } from "../../app/models/User";

const defaultUser: User = {
  name: "",
  firstLastName: "",
  secondLastName: "",
  rut: "",
  email: "",
  career: { id: 0, name: "" },
};

const EditProfile = () => {
  document.title = GenerateTabTitle("Editar Perfil");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { setAuthenticated, setUsername } = useContext(AuthContext);

  const navigate = useNavigate();

  const errorRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>(emptyString);
  const [firstLastName, setFirstLastName] = useState<string>(emptyString);
  const [secondLastName, setSecondLastName] = useState<string>(emptyString);

  const [rut, setRut] = useState<string>(emptyString);
  const [email, setEmail] = useState<string>(emptyString);
  const [career, setCareer] = useState<string>(emptyString);

  // Password state
  const [currentPwd, setCurrentPwd] = useState<string>(emptyString);
  const [pwd, setPwd] = useState<string>(emptyString);
  const [matchPwd, setMatchPwd] = useState<string>(emptyString);

  const [validName, setValidName] = useState<boolean>(false);
  const [validFirstLastName, setValidFirstLastName] = useState<boolean>(false);
  const [validSecondLastName, setValidSecondLastName] =
    useState<boolean>(false);

  const [validCurrentPwd, setCurrentValidPwd] = useState(true);
  const [validPwd, setValidPwd] = useState<boolean>(false);
  const [validMatchPwd, setValidMatchPwd] = useState<boolean>(false);

  const [changePasswordSuccess, setChangePasswordSuccess] =
    useState<boolean>(false);

  const [differentNames, setDifferentNames] = useState<boolean>(false);

  const [tab, setTab] = useState("info");

  const [user, setUser] = useState(defaultUser);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    Agent.Auth.profile()
      .then((response) => {
        setUser(response);
        setName(response.name);
        setFirstLastName(response.firstLastName);
        setSecondLastName(response.secondLastName);
        setRut(response.rut);
        setEmail(response.email);
        setCareer(startCase(response.career.name));
        setUsername(response.name);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [setUsername]);

  useEffect(() => {
    if (
      name === user.name &&
      firstLastName === user.firstLastName &&
      secondLastName === user.secondLastName
    ) {
      setDifferentNames(false);
    } else {
      setDifferentNames(true);
    }

    if (Regex.nameRegex.test(name)) {
      setValidName(true);
    } else {
      setValidName(false);
    }

    if (Regex.nameRegex.test(firstLastName)) {
      setValidFirstLastName(true);
    } else {
      setValidFirstLastName(false);
    }

    if (Regex.nameRegex.test(secondLastName)) {
      setValidSecondLastName(true);
    } else {
      setValidSecondLastName(false);
    }
  }, [
    name,
    firstLastName,
    secondLastName,
    user.name,
    user.firstLastName,
    user.secondLastName,
  ]);

  useEffect(() => {
    if (Regex.pwdRegex.test(pwd)) {
      setValidPwd(true);
    } else {
      setValidPwd(false);
    }

    if (pwd === matchPwd) {
      setValidMatchPwd(true);
    } else {
      setValidMatchPwd(false);
    }
  }, [pwd, matchPwd]);

  useEffect(() => {
    const getUrl = new URL(window.location.href);
    getUrl.searchParams.set("tab", tab);
    window.history.pushState({}, "", getUrl.href);
  }, [tab]);

  const clearInputs = (names: boolean, password: boolean, cancel: boolean) => {
    if (names) {
      if (!cancel) {
        user.name = name;
        user.firstLastName = firstLastName;
        user.secondLastName = secondLastName;
      }
      setName(user.name);
      setFirstLastName(user.firstLastName);
      setSecondLastName(user.secondLastName);
    } else if (password) {
      setCurrentPwd("");
      setPwd("");
      setMatchPwd("");
    }
  };

  const sendMyInfoData = (
    name: string,
    firstLastName: string,
    secondLastName: string
  ) => {
    Agent.Auth.updateProfile({
      name,
      firstLastName,
      secondLastName,
    })
      .then((response) => {
        user.name = name;
        user.firstLastName = firstLastName;
        user.secondLastName = secondLastName;
        setDifferentNames(false);
        setUsername(response.name);
        toast.success("Datos actualizados correctamente");
      })
      .catch(() => {});
  };

  const sendPasswordData = (
    password: string,
    currentPassword: string,
    repeatedPassword: string
  ) => {
    Agent.Auth.updatePassword({ password, currentPassword, repeatedPassword })
      .then((response) => {
        setChangePasswordSuccess(true);
      })
      .catch((error) => {
        setCurrentValidPwd(false);
      });
  };

  const handleCloseDialog = () => {
    setChangePasswordSuccess(false);
    localStorage.removeItem("token");
    setAuthenticated(false);
    navigate("/");
  };

  const handleSubmitMyInfo = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!name && !firstLastName && !secondLastName) {
      return;
    } else if (
      name === user.name &&
      firstLastName === user.firstLastName &&
      secondLastName === user.secondLastName
    ) {
      return;
    }

    if (
      !Regex.nameRegex.test(name) ||
      !Regex.nameRegex.test(firstLastName) ||
      !Regex.nameRegex.test(secondLastName)
    ) {
      return;
    }

    try {
      sendMyInfoData(name, firstLastName, secondLastName);
    } catch (error: any) {
      if (error?.response) {
        if (error.response.status === 409) {
        } else {
        }
      } else {
      }

      if (errorRef.current) {
        errorRef.current.focus();
      }
    }
  };

  const handleSubmitPassword = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!pwd) {
      clearInputs(false, true, false);
      return;
    } else if (
      !Regex.pwdRegex.test(pwd) ||
      !Regex.pwdRegex.test(currentPwd) ||
      pwd !== matchPwd ||
      !currentPwd
    ) {
      clearInputs(false, true, false);
      return;
    }

    try {
      sendPasswordData(pwd, currentPwd, matchPwd);

      clearInputs(false, true, false);
    } catch (error: any) {}
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          marginTop: "2%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: tab === "info" ? "1%" : "1.6%",
            border: `1px solid ${Colors.primaryBlue}`,
            borderRadius: "8px",
            width:
              tab === "password" && !isSmallScreen
                ? "64.5%"
                : tab === "info" && !isSmallScreen
                ? "40%"
                : "" && tab && isSmallScreen
                ? "60%"
                : "",
            height: "fit-content",
          }}
        >
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Grid container style={{ padding: isSmallScreen ? "row" : "column" }}>
            <Grid item style={{ marginLeft: "5%", marginRight: "10%" }}>
              <Typography
                fontSize={"180%"}
                color={tab === "info" ? "black" : "#626262"}
                variant="h5"
                style={{ cursor: "pointer" }}
                onClick={() => setTab("info")}
              >
                Mis Datos
              </Typography>
            </Grid>
            <Grid item style={{ marginRight: "5%" }}>
              <Typography
                fontSize={"180%"}
                color={tab === "password" ? "black" : "#626262"}
                variant="h5"
                style={{
                  cursor: "pointer",
                  marginLeft: isSmallScreen ? "10%" : "",
                }}
                onClick={() => setTab("password")}
              >
                Contraseña
              </Typography>
            </Grid>
          </Grid>
          {tab === "info" && (
            <Box component="form" noValidate onSubmit={handleSubmitMyInfo}>
              <Grid
                container
                spacing={2}
                sx={{ padding: "2vh", width: "100%", height: "100%" }}
              >
                <Grid item xs={12} sm={6}>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    Nombre
                  </Typography>
                  <TextField
                    id="name"
                    name="name"
                    value={name}
                    error={!validName}
                    helperText={!validName ? ApiMessages.invalidNames : ""}
                    required
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    RUT
                  </Typography>
                  <TextField
                    id="dni"
                    name="dni"
                    value={rut}
                    label=""
                    required
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    Primer apellido
                  </Typography>
                  <TextField
                    id="firstLastName"
                    name="firstLastName"
                    value={firstLastName}
                    label=""
                    error={!validFirstLastName}
                    helperText={
                      !validFirstLastName ? ApiMessages.invalidNames : ""
                    }
                    required
                    fullWidth
                    onChange={(e) => setFirstLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    Segundo apellido
                  </Typography>
                  <TextField
                    id="secondLastName"
                    name="secondLastName"
                    value={secondLastName}
                    label=""
                    error={!validSecondLastName}
                    helperText={
                      !validSecondLastName ? ApiMessages.invalidNames : ""
                    }
                    required
                    fullWidth
                    onChange={(e) => setSecondLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    Correo electrónico
                  </Typography>
                  <TextField
                    id="email"
                    name="email"
                    value={email}
                    label=""
                    required
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    Carrera
                  </Typography>
                  <TextField
                    variant="outlined"
                    name="career"
                    value={career}
                    label=""
                    select
                    fullWidth
                    disabled
                    onChange={(e) => setCareer(e.target.value)}
                  >
                    {<MenuItem value={career}>{career}</MenuItem>}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      marginLeft: "2%",
                      display: "flex",
                      flexDirection: isSmallScreen ? "column" : "row",
                      marginTop: "2%",
                      marginBottom: "2%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      name="cancel-button"
                      variant="outlined"
                      color="secondary"
                      style={{
                        color: `${Colors.primaryRed}`,
                        marginRight: isSmallScreen ? "0" : "16px",
                        marginBottom: isSmallScreen ? "16px" : "0",
                        transform: "scale(1.05)",
                        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                        fontFamily: "Raleway, sans-serif",
                        fontSize: "85%",
                        border: `1px solid ${Colors.primaryRed}`,
                      }}
                      onClick={() => {
                        clearInputs(true, false, true);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      name="update-button"
                      type="submit"
                      variant="contained"
                      color="warning"
                      disabled={
                        !validName ||
                        !validFirstLastName ||
                        !validSecondLastName ||
                        !differentNames
                      }
                      style={{
                        transform: "scale(1.05)",
                        color: "black",
                        backgroundColor:
                          validName &&
                          validFirstLastName &&
                          validSecondLastName &&
                          differentNames
                            ? `${Colors.primaryOrange}`
                            : `${Colors.primaryGray}`,
                        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                        fontFamily: "Raleway, sans-serif",
                        fontSize: "85%",
                      }}
                    >
                      Guardar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          {tab === "password" && (
            <Box component="form" noValidate onSubmit={handleSubmitPassword}>
              <Grid
                container
                spacing={2}
                sx={{ padding: "2vh", width: "100%", height: "100%" }}
              >
                <Grid item xs={12}>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    Contraseña Actual
                  </Typography>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    value={currentPwd}
                    label=""
                    helperText={!validCurrentPwd ? ApiMessages.invalidPwd : ""}
                    required
                    fullWidth
                    onChange={(e) => [setCurrentPwd(e.target.value)]}
                  />
                </Grid>
                <Grid item xs={12} container>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    Nueva Contraseña
                  </Typography>
                  <TextField
                    id="new-password"
                    name="new-password"
                    type="password"
                    value={pwd}
                    error={!validPwd && pwd.trim() !== emptyString}
                    helperText={
                      !validPwd && pwd.trim() !== emptyString
                        ? ApiMessages.requisitesPwd
                        : ""
                    }
                    label=""
                    required
                    fullWidth
                    onChange={(e) => setPwd(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    style={{
                      marginRight: "100%",
                      fontSize: "85%",
                      fontFamily: "Raleway, sans-serif",
                    }}
                  >
                    Repetir Nueva Contraseña
                  </Typography>
                  <TextField
                    id="repeat-new-password"
                    name="repeat-new-password"
                    type="password"
                    value={matchPwd}
                    error={!validMatchPwd && matchPwd.trim() !== emptyString}
                    helperText={
                      !validMatchPwd && matchPwd.trim() !== emptyString
                        ? ApiMessages.invalidMatchPwd
                        : ""
                    }
                    label=""
                    required
                    fullWidth
                    onChange={(e) => setMatchPwd(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      marginLeft: "2%",
                      display: "flex",
                      flexDirection: isSmallScreen ? "column" : "row",
                      marginTop: "2%",
                      marginBottom: "2%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      name="cancel-button"
                      variant="outlined"
                      color="secondary"
                      style={{
                        color: `${Colors.primaryRed}`,
                        marginRight: isSmallScreen ? "0" : "16px",
                        marginBottom: isSmallScreen ? "16px" : "0",
                        transform: "scale(1.05)",
                        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                        fontFamily: "Raleway, sans-serif",
                        fontSize: "85%",
                        border: `1px solid ${Colors.primaryRed}`,
                      }}
                      onClick={() => {
                        clearInputs(false, true, true);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      name="update-button"
                      type="submit"
                      variant="contained"
                      color="warning"
                      disabled={!validPwd || !validMatchPwd}
                      style={{
                        transform: "scale(1.05)",
                        color: "black",
                        backgroundColor:
                          validPwd && validMatchPwd
                            ? `${Colors.primaryOrange}`
                            : `${Colors.primaryGray}`,
                        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                        fontFamily: "Raleway, sans-serif",
                        fontSize: "85%",
                      }}
                    >
                      Actualizar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
      {/* Successful Password Change Dialog */}
      <Dialog open={changePasswordSuccess} onClose={handleCloseDialog}>
        <DialogTitle>Cambio de Contraseña Exitoso</DialogTitle>
        <DialogContent>
          <Typography>
            Tu contraseña se ha cambiado exitosamente. Se cerrará la sesión.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EditProfile;
