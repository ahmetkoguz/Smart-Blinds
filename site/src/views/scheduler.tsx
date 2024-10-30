import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SaveSchedule } from "./saveSchedule";
import { Grid2, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useState, useEffect } from 'preact/hooks';
import dayjs from 'dayjs';

export const Scheduler = () => {
    const [scheduleData, setData] = useState({lower: "0:00", raise: "0:00"});
    const [raiseTime, setRaiseTime] = useState(dayjs("2024-04-17T"+scheduleData?.raise));
    const [lowerTime, setLowerTime] = useState(dayjs("2024-04-17T"+scheduleData?.lower));
    const [weekdays, setWeekdays] = useState(() => []);

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
                    <ToggleButton value="Monday" aria-label="Monday">
                        MON
                    </ToggleButton>
                    <ToggleButton value="Tuesday" aria-label="Tuesday">
                        TUE
                    </ToggleButton>
                    <ToggleButton value="Wednesday" aria-label="Wednesday">
                        WED
                    </ToggleButton>
                    <ToggleButton value="Thursday" aria-label="Thursday">
                        THU
                    </ToggleButton>
                    <ToggleButton value="Friday" aria-label="Friday">
                        FRI
                    </ToggleButton>
                    <ToggleButton value="Saturday" aria-label="Saturday">
                        SAT
                    </ToggleButton>
                    <ToggleButton value="Sunday" aria-label="Sunday">
                        SUN
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid2>
            <Grid2>
                <SaveSchedule raiseTime={raiseTime} lowerTime={lowerTime} weekdaysList={weekdays} />
        </Grid2></>
    )
}