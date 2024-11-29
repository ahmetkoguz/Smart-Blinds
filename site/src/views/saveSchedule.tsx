import { Button } from "@mui/material";

export const SaveSchedule = ({ raiseTime, lowerTime, weekdaysList }) => {
  const onClick = async () => {
    const raise = raiseTime["$H"] + ":" + raiseTime["$m"]
    const lower = lowerTime["$H"] + ":" + lowerTime["$m"]
    const weekdays = weekdaysList.toString();

    let dateTime = new Date();
    const curr_time = dateTime.toDateString() + " " + dateTime.toLocaleTimeString("en-US", { hour: "2-digit", "minute": "2-digit", "second": "2-digit",  hour12: false });

    console.log(curr_time)
    console.log(raise, lower, weekdays)

    // Trigger backend endpoint, sending http post request
    await fetch("/api/setSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raise, lower, weekdays, curr_time }),
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
