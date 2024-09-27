import { ArrowUpward, Cancel, CancelOutlined } from "@mui/icons-material";
import { Button, createTheme, styled, Typography } from "@mui/material";
import { useState } from "preact/hooks";

const StyledButton = styled(Button)(({ theme }) => ({
// const StyledButton = styled(Button)(({ isOn, theme }) => ({
  color: theme.palette.error.main,
  '&:disabled': {
    // color: isOn ? theme.palette.warning.main: 'disabled',
  },
}));

export const Stop = ({ isActive, handleActive }) => {
  const [isOn, setIsOn] = useState(false);

  const onClick = async () => {
    handleActive(false)
    setIsOn(true);
    await fetch("/api/stop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isOn }),
    });
  };

  const theme = createTheme();

  return (
    <StyledButton 
      // isOn={isOn}
      theme={theme}
      disabled={!isActive}
      onClick={onClick} 
      variant='outlined'
      color='error'
      startIcon={<Cancel/>}
      fullWidth
    >
        STOP
    </StyledButton>
  )
};
