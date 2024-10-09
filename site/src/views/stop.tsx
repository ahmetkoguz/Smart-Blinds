import { Cancel } from "@mui/icons-material";
import { Button } from "@mui/material";

export const Stop = ({ isActive, handleActive, resetSignals }) => {
  const onClick = async () => {
    handleActive(false);
    resetSignals();

    let is_on = false;
    await fetch("/api/raise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_on }),
    });
    await fetch("/api/lower", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_on }),
    });
  };

  return (
    <Button 
      disabled={!isActive}
      onClick={onClick} 
      variant='outlined'
      color='error'
      startIcon={<Cancel/>}
      fullWidth
    >
        STOP
    </Button>
  )
};
