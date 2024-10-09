import { ArrowUpward } from "@mui/icons-material";
import { Button, createTheme, Typography } from "@mui/material";

export const Raise = ({ isActive, handleActive, raise, setRaise }) => {
  const onClick = async () => {
    handleActive(true);
    setRaise(true);
    let is_on = true;
    await fetch("/api/raise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_on }), // name must match payload name in backend
    });
  };

  const theme = createTheme();

  return (
    <Button 
      disabled={isActive}
      onClick={onClick} 
      sx={{
        color: theme.palette.grey[700], padding: 1, display: 'flex', flexDirection: 'column', rowGap: '10px', width: '75px', '&:disabled': {color: raise ? theme.palette.warning.main: 'disabled',},
      }}
    >
      <ArrowUpward></ArrowUpward>
      <Typography variant='body2' color='textSecondary'>RAISE</Typography>
    </Button>
  )
};
