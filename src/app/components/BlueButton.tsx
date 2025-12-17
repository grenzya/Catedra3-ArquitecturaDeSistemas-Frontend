import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import Colors from "../static/colors";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(Colors.primaryBlue),
  backgroundColor: Colors.primaryBlue,
  "&:hover": {
    backgroundColor: Colors.primaryBlue,
  },
}));

export default ColorButton;
