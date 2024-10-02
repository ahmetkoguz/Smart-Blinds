import { ArrowDownward } from "@mui/icons-material";
import { Button, createTheme, Typography } from "@mui/material";

export const Lower = ({ isActive, handleActive, lower, setLower }) => {
  const onClick = async () => {
    handleActive(true);
    setLower(true);
    await fetch("/api/lower", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lower }),
    });
  };

  const theme = createTheme();

  return (
    <Button 
      disabled={isActive}
      onClick={onClick} 
      sx={{
        color: theme.palette.grey[700],padding: 1, display: 'flex', flexDirection: 'column', rowGap: '10px', width: '75px', '&:disabled': {color: lower ? theme.palette.warning.main: 'disabled',},
      }}
    >
      <ArrowDownward></ArrowDownward>
      <Typography variant='body2' color='textSecondary'>LOWER</Typography>
    </Button>
  )
};
