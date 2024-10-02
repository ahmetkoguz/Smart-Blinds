import { ArrowDownward } from "@mui/icons-material";
import { Button, createTheme, Typography } from "@mui/material";
import { useState } from "preact/hooks";

export const Lower = ({ isActive, handleActive }) => {
  const [isOn, setIsOn] = useState(false);

  const onClick = async () => {
    handleActive(true);
    setIsOn(true);
    await fetch("/api/lower", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isOn }),
    });
  };

  const theme = createTheme();

  return (
    <Button 
      disabled={isActive}
      onClick={onClick} 
      sx={{
        color: theme.palette.grey[700],padding: 1, display: 'flex', flexDirection: 'column', rowGap: '10px', width: '75px', '&:disabled': {color: isOn ? theme.palette.warning.main: 'disabled',},
      }}
    >
      <ArrowDownward></ArrowDownward>
      <Typography variant='body2' color='textSecondary'>LOWER</Typography>
    </Button>
  )
};
