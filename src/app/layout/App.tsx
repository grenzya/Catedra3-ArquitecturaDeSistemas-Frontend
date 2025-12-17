import React from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Routes from "../router/Routes";
import { SubjectCodeProvider } from "../context/SubjectCodeContext";

function App() {

  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <SubjectCodeProvider>
            <Routes />
          </SubjectCodeProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
