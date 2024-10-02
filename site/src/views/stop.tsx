import { Cancel } from "@mui/icons-material";
import { Button } from "@mui/material";

export const Stop = ({ isActive, handleActive, resetSignals }) => {
  const onClick = async () => {
    handleActive(false)
    resetSignals();
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
