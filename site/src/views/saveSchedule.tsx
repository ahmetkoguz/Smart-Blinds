import { Button } from "@mui/material";

export const SaveSchedule = ({ date }) => {
  const onClick = async () => {
    await fetch("/api/setSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    });
  };

  return (
    <Button 
      onClick={onClick} 
      color='primary'
    >
        Save Schedule
    </Button>
  )
};
