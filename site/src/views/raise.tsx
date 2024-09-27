import { ArrowUpward } from "@mui/icons-material";
import { Button, createTheme, styled, Typography } from "@mui/material";
import { useState } from "preact/hooks";

const StyledButton = styled(Button)(({ theme }) => ({
// const StyledButton = styled(Button)(({ isOn, theme }) => ({
  color: theme.palette.grey[700],
  '&:disabled': {
    // color: isOn ? theme.palette.warning.main: 'disabled',
  },
}));

export const Raise = ({ isActive, handleActive }) => {
  const [isOn, setIsOn] = useState(false);

  const onClick = async () => {
    handleActive(true)
    setIsOn(true);
    await fetch("/api/raise", {
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
      disabled={isActive}
      onClick={onClick} 
      sx={{
        padding: 1, display: 'flex', flexDirection: 'column', rowGap: '10px', width: '75px'
      }}
    >
      <ArrowUpward></ArrowUpward>
      <Typography variant='body2' color='textSecondary'>RAISE</Typography>
    </StyledButton>
  )
};
