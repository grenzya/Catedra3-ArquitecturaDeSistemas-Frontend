import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import Colors from "../static/colors";

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      <CircularProgress
        size={90}
        sx={{
          color: Colors.primaryBlue,
          marginBottom: "2rem",
        }}
      />
      <Typography variant="h4" component="h3">Cargando...</Typography>
    </Box>
  );
};

export default LoadingSpinner;
