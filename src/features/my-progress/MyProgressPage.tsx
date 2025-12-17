import React, { useContext } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import agent from "../../app/api/agent";
import { Subject } from "../../app/models/Subject";
import { PreRequisite } from "../../app/models/PreRequisite";
import { PostRequisite } from "../../app/models/PostRequisite";
import { subjectsCapitalize } from "../../app/utils/StringUtils";
import HelpIcon from "@mui/icons-material/Help";
import SquareIcon from "@mui/icons-material/Square";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import NearMeIcon from "@mui/icons-material/NearMe";
import Colors from "../../app/static/colors";
import GenerateTabTitle from "../../app/utils/TitleGenerator";
import ProgressCard, { modifySubject } from "./ProgressCard";
import { forEach } from "lodash";
import LoadingSpinner from "../../app/layout/LoadingSpinner";
import { AuthContext } from "../../app/context/AuthContext";

// Item style
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: Colors.primaryBlue,
  color: Colors.white,
  padding: theme.spacing(1),
  textAlign: "center",
}));

// Semester roman numerals for items
const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// Semester roman numeral generator
const romanNumeral = (numeral: number) => {
  return numerals[numeral - 1];
};

// Subjects state
const subjectsState = [
  {
    type: "Asignaturas aprobadas",
    description: "Aquellas asignaturas que ya aprobaste en tu malla curricular",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.primaryGray }} />
    ),
  },
  {
    type: "Asignaturas por cursar",
    description:
      "Aquellas asignaturas que puedes cursar basado en lo que aprobaste",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.secondaryGreen }} />
    ),
  },
  {
    type: "Asignaturas fuera de proyección",
    description:
      "Aquellas asignaturas que puedes cursar pero que, probablemente, no puedas inscribir por dispersión",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.secondaryYellow }} />
    ),
  },
  {
    type: "Asignaturas no cursadas",
    description:
      "Aquellas asignaturas que aún no cursas y que, probablemente, todavía no puedes cursar",
    icon: (
      <SquareOutlinedIcon style={{ fontSize: "200%", color: Colors.black }} />
    ),
  },
];

export let approvedSubjects = [] as string[];

const MyProgressPage = () => {
  document.title = GenerateTabTitle("Mi Progreso");

  const { username } = useContext(AuthContext);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const preRequisites = useRef<PreRequisite>({});
  const PostRequisites = useRef<PostRequisite>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userApprovedSubjects, setUserApprovedSubjects] = useState<string[]>(
    []
  );
  const [helpDialogOpen, setHelpDialogOpen] = useState<boolean>(false);
  const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false);

  const isLargeScreen = useMediaQuery("(min-width:1600px)");

  useEffect(() => {
    setIsLoading(true);

    const loadSubjects = agent.Subjects.list().then((res: Subject[]) => {
      res.forEach((s) => (s.name = subjectsCapitalize(s.name)));
      setSubjects(res);
    });

    const loadPreRequisites = agent.Subjects.preRequisites().then((res) => {
      preRequisites.current = res;
    });

    const loadPostRequisites = agent.Subjects.postRequisites().then((res) => {
      PostRequisites.current = res;
    });

    const userProgress = agent.Auth.myProgress().then((response) => {
      forEach(response, (value) => {
        setUserApprovedSubjects((userApprovedSubjects) => [
          ...userApprovedSubjects,
          value.subjectCode,
        ]);
        approvedSubjects.push(value.subjectCode);
      });
    });

    Promise.all([
      loadSubjects,
      loadPreRequisites,
      loadPostRequisites,
      userProgress,
    ])
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Validate if subject has pre-requisites
  const hasPreReq = (subjectCode: string) => {
    let hasPreReq = true;
    const preReq = preRequisites.current[subjectCode];
    if (!preReq && !userApprovedSubjects.includes(subjectCode))
      hasPreReq = false;
    else if (preReq) {
      forEach(preReq, (value) => {
        if (!userApprovedSubjects.includes(value)) hasPreReq = false;
      });
    }

    return hasPreReq;
  };

  const getPreReqLength = (subjectCode: string) => {
    const preReq = preRequisites.current[subjectCode];
    return preReq ? preReq.length : 0;
  };

  // Validate if subject is out of projection
  const iOutOfProyection = (subject: any) => {
    if (approvedSubjects.length === 0) {
      return false;
    }

    let studentLevel = Math.max(
      ...subjects
        .filter((subject) => userApprovedSubjects.includes(subject.code))
        .map((subject) => subject.semester)
    );

    if (subject.semester > studentLevel + 2 && hasPreReq(subject.code)) {
      return true;
    } else if (
      subject.semester > studentLevel + 2 &&
      getPreReqLength(subject.code) === 0
    ) {
      return true;
    }

    return false;
  };

  // Put background color to subject
  const backgroundColorButton = (subject: any) => {
    if (userApprovedSubjects.includes(subject.code)) {
      return Colors.primaryGray;
    } else if (iOutOfProyection(subject)) {
      return Colors.secondaryYellow;
    } else if (hasPreReq(subject.code)) {
      return Colors.secondaryGreen;
    }

    return Colors.white;
  };

  // Map subjects by semester
  const mapSubjectsBySemester = (
    subjects: Subject[],
    semester: number,
    isLargeScreen: boolean
  ) =>
    subjects.map((subject) => {
      if (subject.semester === semester) {
        const mappedSubject = (
          <ProgressCard
            key={subject.code}
            subject={subject}
            isLargeScreen={isLargeScreen}
            backgroundColorButton={backgroundColorButton(subject)}
          />
        );
        return mappedSubject;
      }
      return null;
    });

  const openHelpDialog = () => {
    setHelpDialogOpen(true);
  };

  const closeHelpDialog = () => {
    setHelpDialogOpen(false);
  };

  // Save subjects
  const saveSubjects = () => {
    if (
      modifySubject.addSubjects.length === 0 &&
      modifySubject.deleteSubjects.length === 0
    ) {
      return;
    }
    setIsSavingChanges(true);
    agent.Auth.updateMyProgress(modifySubject)
      .then((res) => {
        approvedSubjects.push(...modifySubject.addSubjects);
        approvedSubjects = approvedSubjects.filter(
          (subject) => !modifySubject.deleteSubjects.includes(subject)
        );
        setUserApprovedSubjects(approvedSubjects);
        cancelSubjects();
      })
      .catch(() => {})
      .finally(() => setIsSavingChanges(false));
  };

  // Cancel subjects and clean arrays
  const cancelSubjects = () => {
    if (
      modifySubject.addSubjects.length === 0 &&
      modifySubject.deleteSubjects.length === 0
    ) {
      return;
    }
    // Delete all subjects from array
    modifySubject.addSubjects = [];
    modifySubject.deleteSubjects = [];
    setIsLoading(true);
    agent.Subjects.list()
      .then((res: Subject[]) => {
        res.forEach((s) => (s.name = subjectsCapitalize(s.name)));
        setSubjects(res);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  if (isLoading || isSavingChanges) return <LoadingSpinner />;

  return (
    <Box sx={{ flexGrow: 1, padding: "0 1rem 0", marginTop: "1.5rem" }}>
      {/* My Progress */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        style={{ marginLeft: "9%", width: "84%" }}
      >
        {/* Title */}
        <Typography variant="h3" component="span">
          ¡Hola{" "}
          <Typography
            variant="h3"
            component="span"
            style={{ color: Colors.primaryBlue, display: "inline" }}
          >
            {username}
          </Typography>
          ! Bienvenid@ a tu progreso
        </Typography>
        <HelpIcon
          style={{ fontSize: "350%", color: Colors.primaryOrange }}
          onClick={openHelpDialog}
        />
      </Grid>
      {/* Subject types top info */}
      <Grid
        container
        alignItems="center"
        style={{ marginLeft: "9%", width: "84%", marginTop: "1%" }}
      >
        {subjectsState.map((subjectType, index) => (
          <React.Fragment key={index}>
            {subjectType.icon}
            <Typography
              variant="h3"
              component="span"
              style={{ fontSize: "100%", marginRight: "2%" }}
            >
              {subjectType.type}
            </Typography>
          </React.Fragment>
        ))}
        {/* Cancel button */}
        <Button
          name="cancel-button"
          variant="outlined"
          color="secondary"
          style={{
            color: `${Colors.primaryRed}`,
            border: `1px solid ${Colors.primaryRed}`,
            fontFamily: "Raleway, sans-serif",
            fontSize: "85%",
            transform: "scale(1.05)",
            marginLeft: "auto",
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          }}
          onClick={cancelSubjects}
        >
          Cancelar
        </Button>
        {/* Save button */}
        <Button
          name="update-button"
          type="submit"
          variant="contained"
          color="warning"
          style={{
            color: "white",
            backgroundColor: `${Colors.primaryBlue}`,
            fontFamily: "Raleway, sans-serif",
            fontSize: "85%",
            transform: "scale(1.05)",
            marginLeft: "2%",
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          }}
          onClick={saveSubjects}
        >
          Guardar
        </Button>
      </Grid>
      {/* My Progress Mesh */}
      <Grid container spacing={2} sx={{ margin: "0.1rem 0 1rem" }}>
        <Grid item xs={1} />
        {Array.from({ length: 10 }).map((_, index) => (
          <Grid item xs={12} md={3} lg={1} key={index}>
            <Item>{romanNumeral(index + 1)}</Item>
            {mapSubjectsBySemester(subjects, index + 1, isLargeScreen)}
          </Grid>
        ))}
        <Grid item xs={1} />
      </Grid>
      {/* Subject types pop-up info */}
      <Dialog open={helpDialogOpen} onClose={closeHelpDialog}>
        <DialogTitle
          style={{
            textAlign: "center",
            borderBottom: "2px solid black",
            fontSize: "250%",
          }}
        >
          Mi Progreso
        </DialogTitle>
        <DialogContent>
          <Typography
            style={{ paddingTop: "5%", paddingBottom: "2%", fontSize: "160%" }}
          >
            El significado de los colores
          </Typography>
          {subjectsState.map((subjectType, index) => (
            <React.Fragment key={index}>
              <Typography
                variant="subtitle1"
                style={{ marginTop: "2%", fontSize: "120%" }}
              >
                <Grid container alignItems="center">
                  {subjectType.icon} {subjectType.type}
                </Grid>
                <Typography
                  style={{ marginTop: "2%", fontSize: "80%", marginLeft: "8%" }}
                >
                  {subjectType.description}
                </Typography>
              </Typography>
            </React.Fragment>
          ))}
          <Typography
            style={{ paddingTop: "2%", paddingBottom: "2%", fontSize: "160%" }}
          >
            Su Uso
          </Typography>
          <Grid container alignItems="center">
            <NearMeIcon
              style={{ fontSize: "200%", color: Colors.primaryBlue }}
            />
            <Typography
              style={{ marginTop: "2%", fontSize: "125%", marginLeft: "2%" }}
            >
              Seleccionar una asignatura
            </Typography>
          </Grid>
          <Typography style={{ marginLeft: "8%", fontSize: "100%" }}>
            Seleccionar una asignatura la marcará como aprobada. Deseleccionar
            una asignatura previamente aprobada la marcará como no aprobada
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHelpDialog}></Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProgressPage;
