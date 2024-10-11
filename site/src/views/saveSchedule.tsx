import { Button } from "@mui/material";

export const SaveSchedule = ({ raiseTime, lowerTime, weekdays }) => {
  const onClick = async () => {
    const raise = raiseTime["$H"] + ":" + raiseTime["$m"]
    const lower = lowerTime["$H"] + ":" + lowerTime["$m"]

    // console.log(raise, lower, weekdays)

    await fetch("/api/setSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raise, lower, weekdays }),
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
