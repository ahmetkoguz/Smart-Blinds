import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SaveSchedule } from "./saveSchedule";
import { Grid2, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useState, useEffect } from 'preact/hooks';
import dayjs from 'dayjs';
import styled from '@emotion/styled';

const StyledButton = styled(ToggleButton)({
    color: "rgb(25, 118, 210)",
    borderColor: "rgb(25, 118, 210)",
    "&.Mui-selected, &.Mui-selected:hover": {
        color: "white",
        backgroundColor: "rgb(25, 118, 210)",
    }
});

const getDayOfWeek = (date) => {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

export const Scheduler = () => {
    const [scheduleData, setData] = useState({lower: "0:00", raise: "0:00"});
    const [raiseTime, setRaiseTime] = useState(dayjs("2024-04-17T"+scheduleData?.raise));
    const [lowerTime, setLowerTime] = useState(dayjs("2024-04-17T"+scheduleData?.lower));
    const [weekdays, setWeekdays] = useState(() => []);

        // Set timer for every minute to check if schedule is ready (but this won't work outside the app?)
        // setInterval(async function() {
        //     let dateTime = new Date();
        //     const curr_day = getDayOfWeek(dateTime);
        //     const curr_time = dateTime.toLocaleTimeString("en-US", { hour: "2-digit", "minute": "2-digit", hour12: false });

        //     console.log(curr_day, curr_time);

        //     const raise = raiseTime["$H"] + ":" + raiseTime["$m"]
        //     const lower = lowerTime["$H"] + ":" + lowerTime["$m"]

        //     console.log(weekdays);

        //     if(weekdays.includes(curr_day)) {
        //         console.log(raise, lower)
        //         if(raise == curr_time) {
        //             console.log("Raise trigger");
        //             let is_on = true;
        //             await fetch("/api/raise", {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({ is_on }), // name must match payload name in backend
        //             });
        //         }
        //         if(lower == curr_time) {
        //             console.log("Lower trigger");
        //             let is_on = true;
        //             await fetch("/api/lower", {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({ is_on }), // name must match payload name in backend
        //             });
        //         }
        //     }
        // }, 60 * 1000);
    
    useEffect(() => {
        // Trigger backend endpoint, sending http get request
        fetch("/api/setSchedule")
            .then((res) => res.json().then(val => {
                setData(val);
                setLowerTime(dayjs("2024-04-17T"+val?.lower));
                setRaiseTime(dayjs("2024-04-17T"+val?.raise));
                setWeekdays((val?.weekdays).split(','))
            })), {
                method: 'GET'
            }

    }, []);

    const handleWeekdays = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {
        setWeekdays(newFormats);
    };

    return (
        <><Grid2>
            <Grid2 display='flex' gap={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid2>
                        <Typography color='textSecondary'>Raise Time</Typography>
                        <TimePicker
                            value={raiseTime}
                            onChange={(newValue) => setRaiseTime(newValue)} />
                    </Grid2>
                    <Grid2>
                        <Typography color='textSecondary'>Lower Time</Typography>
                        <TimePicker
                            value={lowerTime}
                            onChange={(newValue) => setLowerTime(newValue)} />
                    </Grid2>
                </LocalizationProvider>
            </Grid2>
        </Grid2>
            <Grid2>
                <ToggleButtonGroup
                    value={weekdays}
                    onChange={handleWeekdays}
                    color="primary"
                    aria-label="set weekdays"
                    size={"small"} // make this dynamic to xs
                >
                    <StyledButton value="Monday" aria-label="Monday">
                        <Typography sx={{ fontSize: "14px" }}>MON</Typography>
                    </StyledButton>
                    <StyledButton value="Tuesday" aria-label="Tuesday">
                        <Typography sx={{ fontSize: "14px" }}>TUE</Typography>
                    </StyledButton>
                    <StyledButton value="Wednesday" aria-label="Wednesday">
                        <Typography sx={{ fontSize: "14px" }}>WED</Typography>
                    </StyledButton>
                    <StyledButton value="Thursday" aria-label="Thursday">
                        <Typography sx={{ fontSize: "14px" }}>THU</Typography>
                    </StyledButton>
                    <StyledButton value="Friday" aria-label="Friday">
                        <Typography sx={{ fontSize: "14px" }}>FRI</Typography>
                    </StyledButton>
                    <StyledButton value="Saturday" aria-label="Saturday">
                        <Typography sx={{ fontSize: "14px" }}>SAT</Typography>
                    </StyledButton>
                    <StyledButton value="Sunday" aria-label="Sunday">
                        <Typography sx={{ fontSize: "14px" }}>SUN</Typography>
                    </StyledButton>
                </ToggleButtonGroup>
            </Grid2>
            <Grid2>
                <SaveSchedule raiseTime={raiseTime} lowerTime={lowerTime} weekdaysList={weekdays} />
        </Grid2></>
    )
}