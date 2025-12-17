import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import agent from "../../app/api/agent";
import SubjectCard from "./SubjectCard";
import { Subject } from "../../app/models/Subject";
import { useSubjectCodeContext } from "../../app/context/SubjectCodeContext";
import { PreRequisite } from "../../app/models/PreRequisite";
import { PostRequisite } from "../../app/models/PostRequisite";
import { subjectsCapitalize } from "../../app/utils/StringUtils";
import GenerateTabTitle from "../../app/utils/TitleGenerator";
import SquareIcon from "@mui/icons-material/Square";
import Colors from "../../app/static/colors";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import LoadingSpinner from "../../app/layout/LoadingSpinner";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1C478F",
  color: "#FFF",
  padding: theme.spacing(1),
  textAlign: "center",
}));

const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const romanNumeral = (numeral: number) => {
  return numerals[numeral - 1];
};

const subjectsState = [
  {
    type: "Asignaturas Pre-Requisito",
    description:
      "Aquellas asignaturas que debes cursar antes de cursar la asignatura seleccionada",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.secondaryYellow }} />
    ),
  },
  {
    type: "Asignatura seleccionada",
    description: "Aquella asignatura que estas viendo en este momento",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.primaryGray }} />
    ),
  },
  {
    type: "Asignaturas Post-Requisito",
    description:
      "Aquellas asignaturas que la asignatura seleccionada es requisito para cursarlas",
    icon: (
      <SquareIcon style={{ fontSize: "200%", color: Colors.secondaryGreen }} />
    ),
  },
];

const InteractiveMeshPage = () => {
  document.title = GenerateTabTitle("Malla Interactiva");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const preRequisites = useRef<PreRequisite>({});
  const PostRequisites = useRef<PostRequisite>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setPreReqCodes, setPostReqCodes } = useSubjectCodeContext();

  const isLargeScreen = useMediaQuery("(min-width:1600px)");

  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

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

    Promise.all([loadSubjects, loadPreRequisites, loadPostRequisites])
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const setPreRequisitesColors = (subjectPreRequisites: string[]) => {
    if (!subjectPreRequisites) return;
    setPreReqCodes(subjectPreRequisites);
  };

  const setPostRequisitesColors = (subjectPostRequisites: string[]) => {
    if (!subjectPostRequisites) return;
    setPostReqCodes(subjectPostRequisites);
  };

  const handleMouseOverSubject = (subjectCode: string) => {
    const subjectPreRequisites = preRequisites.current[subjectCode];
    setPreRequisitesColors(subjectPreRequisites);

    const subjectPostRequisites = PostRequisites.current[subjectCode];
    setPostRequisitesColors(subjectPostRequisites);
  };

  const handleMouseExitSubject = () => {
    setPreReqCodes([]);
    setPostReqCodes([]);
  };

  const mapSubjectsBySemester = (
    subjects: Subject[],
    semester: number,
    isLargeScreen: boolean
  ) =>
    subjects.map((subject) => {
      if (subject.semester === semester) {
        const mappedSubject = (
          <SubjectCard
            key={subject.code}
            subject={subject}
            onMouseOver={handleMouseOverSubject}
            onMouseExit={handleMouseExitSubject}
            isLargeScreen={isLargeScreen}
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box sx={{ flexGrow: 1, padding: "0 1rem 0", marginTop: "1.5rem" }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        style={{ marginLeft: "9%", width: "84%" }}
      >
        <Typography variant="h3" component="span">
          Malla Interactiva
        </Typography>
        <HelpIcon
          style={{ fontSize: "350%", color: Colors.primaryOrange }}
          onClick={openHelpDialog}
        />
      </Grid>
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
      </Grid>
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
      <Dialog open={helpDialogOpen} onClose={closeHelpDialog}>
        <DialogTitle
          style={{
            textAlign: "center",
            borderBottom: "2px solid black",
            fontSize: "250%",
          }}
        >
          Malla Interactiva
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
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHelpDialog}></Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractiveMeshPage;
