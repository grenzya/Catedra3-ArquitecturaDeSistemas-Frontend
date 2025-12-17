import React from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import GenerateTabTitle from "../../app/utils/TitleGenerator";
import BlueButton from "../../app/components/BlueButton";
import { Link } from "react-router-dom";
// @ts-ignore
import Cubi12Logo from "../../app/static/images/cubi12.svg";

const imgStyle = { filter: 'grayscale(100%)', maxWidth: "15%", height: "auto" };
const imgPhoneStyle = { filter: 'grayscale(100%)', maxWidth: "40%", height: "auto" };

const NotFound = () => {
  document.title = GenerateTabTitle("Página no encontrada");

  const isSmallScreen = useMediaQuery("(max-width:430px)");

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100%", marginTop: "2rem", textAlign: "center" }}
    >
        <img
        alt="Cubi12Logo"
        src={Cubi12Logo}
        style={isSmallScreen ? imgPhoneStyle : imgStyle}
      />
      <Typography variant="h1" component="h1" style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        ¡Oops!
      </Typography>
      <Typography variant="h3" component="h1" style={{ marginBottom: "1rem" }}>
        Parece que no encontramos lo que estabas buscando.
      </Typography>
      <Typography variant="h6" component="h3" marginTop="1rem" marginBottom="2rem">
        Es posible que la página que solicitaste no exista o haya cambiado su
        ubicación.
      </Typography>
      <Link to={"/"}>
        <BlueButton variant="contained" size="large">
          Volver a Cubi12
        </BlueButton>
      </Link>
    </Grid>
  );
};

export default NotFound;
