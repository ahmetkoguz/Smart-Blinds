import { Button } from "@mui/material";

const getDayOfWeek = (date) => {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

export const SaveSchedule = ({ raiseTime, lowerTime, weekdaysList }) => {
  const onClick = async () => {
    const raise = raiseTime["$H"] + ":" + raiseTime["$m"]
    const lower = lowerTime["$H"] + ":" + lowerTime["$m"]
    const weekdays = weekdaysList.toString();

    let dateTime = new Date();
    const curr_day = getDayOfWeek(dateTime);
    const curr_time = dateTime.toLocaleTimeString("en-US", { hour: "2-digit", "minute": "2-digit", hour12: false });
    // figure out format for backend

    console.log(raise, lower, weekdays)

    // Trigger backend endpoint, sending http post request
    await fetch("/api/setSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raise, lower, weekdays, curr_day, curr_time }),
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
