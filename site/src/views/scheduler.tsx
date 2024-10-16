import { DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SaveSchedule } from "./saveSchedule";
import { Grid2, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useState, useEffect } from 'preact/hooks';

export const Scheduler = () => {
    const [raiseTime, setRaiseTime] = useState();
    const [lowerTime, setLowerTime] = useState();
    const [scheduleData, setData] = useState('');

    const [weekdays, setWeekdays] = useState(() => []);

    useEffect(() => {
        fetch("/api/setSchedule")
            .then((res) => res.json().then(val => {
                setData(val);
            })), {
                method: 'GET'
            }
    }, []);

    console.log(scheduleData);

    const handleWeekdays = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {
        setWeekdays(newFormats);
        // console.log(newFormats);
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
        </Grid2><Grid2>
                <ToggleButtonGroup
                    value={weekdays}
                    onChange={handleWeekdays}
                    color="primary"
                    aria-label="set weekdays"
                >
                    <ToggleButton value="Monday" aria-label="Monday">
                        M
                    </ToggleButton>
                    <ToggleButton value="Tuesday" aria-label="Tuesday">
                        T
                    </ToggleButton>
                    <ToggleButton value="Wednesday" aria-label="Wednesday">
                        W
                    </ToggleButton>
                    <ToggleButton value="Thursday" aria-label="Thursday">
                        TH
                    </ToggleButton>
                    <ToggleButton value="Friday" aria-label="Friday">
                        F
                    </ToggleButton>
                    <ToggleButton value="Saturday" aria-label="Saturday">
                        St
                    </ToggleButton>
                    <ToggleButton value="Sunday" aria-label="Sunday">
                        S
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid2><Grid2>
                <SaveSchedule raiseTime={raiseTime} lowerTime={lowerTime} weekdays={weekdays} />
            </Grid2></>
    )
}