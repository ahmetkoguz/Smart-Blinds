import { Button } from "@mui/material";

export const SaveSchedule = ({ raiseTime, lowerTime, weekdaysList }) => {
  const onClick = async () => {
    const raise = raiseTime["$H"] + ":" + raiseTime["$m"]
    const lower = lowerTime["$H"] + ":" + lowerTime["$m"]
    const weekdays = weekdaysList.toString();

    console.log(raise, lower, weekdays)

    // Trigger backend endpoint, sending http post request
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
      variant='outlined'
    >
        Save Schedule
    </Button>
  )
};
