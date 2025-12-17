import React from "react";
import { Paper } from "@mui/material";
import { Subject } from "../../app/models/Subject";
import { useSubjectCodeContext } from "../../app/context/SubjectCodeContext";
import { useEffect, useState } from "react";
import Colors from "../../app/static/colors";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "10vh",
  width: "100%",
  margin: "1rem 0",
  padding: "0.5rem",
  fontSize: "1rem",
  backgroundColor: "#FFF",
  "&:hover": {
    backgroundColor: Colors.primaryGray,
  },
};

const getFontSizeByLength = (
  currentStyle: any,
  phrase: string,
  isLargeScreen: boolean
) => {
  if (isLargeScreen) {
    if (phrase.length > 40) return { ...currentStyle, fontSize: "0.8rem" };
    return currentStyle;
  }
  if (phrase.length > 40) return { ...currentStyle, fontSize: "0.6rem" };
  if (phrase.length > 35) return { ...currentStyle, fontSize: "0.7rem" };
  else if (phrase.length > 30) return { ...currentStyle, fontSize: "0.8rem" };
  else if (phrase.length > 20) return { ...currentStyle, fontSize: "0.9rem" };
  else return currentStyle;
};

const selectStyle = (
  name: string,
  isLargeScreen: boolean,
  isPreReq: boolean,
  isPostReq: boolean
) => {
  let backgroundColor = "#FFFFFF";
  if (isPostReq) backgroundColor = Colors.secondaryGreen;
  if (isPreReq) backgroundColor = Colors.secondaryYellow;

  return {
    ...getFontSizeByLength(style, name, isLargeScreen),
    backgroundColor,
  };
};

interface Props {
  subject: Subject;
  onMouseOver: (code: string) => void;
  onMouseExit: () => void;
  isLargeScreen: boolean;
}

const SubjectCard = ({
  subject,
  isLargeScreen,
  onMouseOver,
  onMouseExit,
}: Props) => {
  const { code, name } = subject;

  const { preReqCodes, postReqCodes } = useSubjectCodeContext();

  const [isPreReq, setIsPreReq] = useState(false);
  const [isPostReq, setIsPostReq] = useState(false);

  useEffect(() => {
    setIsPreReq(preReqCodes.includes(code));
    setIsPostReq(postReqCodes.includes(code));
  }, [preReqCodes, postReqCodes, code]);

  return (
    <Paper
      onMouseOver={() => onMouseOver(code)}
      onMouseOut={() => onMouseExit()}
      elevation={3}
      sx={selectStyle(name, isLargeScreen, isPreReq, isPostReq)}
    >
      {name}
    </Paper>
  );
};

export default SubjectCard;
