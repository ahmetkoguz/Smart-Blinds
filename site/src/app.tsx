import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid2, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Lower } from "./views/lower";
import { Raise } from "./views/raise";
import { Stop } from "./views/stop";
import { useState } from "preact/hooks";
import { Route } from "wouter";
import { DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SaveSchedule } from "./views/saveSchedule";
import { Lock } from "@mui/icons-material";

export const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [raise, setRaise] = useState(false);
  const [lower, setLower] = useState(false);
  const [date, setDate] = useState();

  const [pin, setPIN] = useState();
  const [pinDialogOpen, setPinDialogOpen] = useState(true);

  const handleOpen = () => {
    setPinDialogOpen(true);
  };

  const handleClose = () => {
    setPinDialogOpen(false);
  };

  const onPINChange = (event) => {
    console.log(event.target.value);

    if(pin == null && event.target.value.length == 4) {
      setPIN(event.target.value);
      handleClose();
    } 
    else if(event.target.value == pin) {
      handleClose();
    }
    else if(pin != null && event.target.value.length == 4 && event.target.value != pin) {
      console.log("incorrect pin");
    }
  }
  
  const PinDialog = () => {
    return (
    <Dialog open={pinDialogOpen} slotProps={{ backdrop: { style: { backgroundColor: "white" } } }} >
      <DialogTitle>Enter PIN</DialogTitle><DialogContent>
      <DialogContentText>
        To gain access to Smart Blinds enter your PIN.
      </DialogContentText>
      <TextField
        autoFocus
        required
        onChange={onPINChange}
        margin="dense"
        id="name"
        name="PIN"
        label="PIN"
        type="password"
        fullWidth
        variant="standard" 
        inputProps={{ maxLength: 4 }}
      />
        </DialogContent><DialogActions>
      </DialogActions>
    </Dialog>
  )
}

  const resetSignals = () => {
    setLower(false);
    setRaise(false);
  }

  const [formats, setFormats] = useState(() => []);

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setFormats(newFormats);
  };


  return (
    <Route path="/">
      <Container maxWidth='sm'>
        <PinDialog />
          <Grid2 container rowSpacing='50px' sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
            {/* Title */}
            <Grid2 size={12} display='flex' justifyContent='center'>
              <Typography color='primary' fontSize='3rem' variant='h2'>Smart Blinds</Typography>
            </Grid2>

            {/* Status */}
            <Grid2>
              <Grid2 size={4} display='flex' pb='22px'>
                <Typography color='textPrimary' variant='h4'>Current Status</Typography>
              </Grid2>
              <Grid2 size={4} display='flex' justifyContent='center' columnGap='60px'>
                <Raise isActive={isActive} handleActive={setIsActive} raise={raise} setRaise={setRaise}/>
                <Lower isActive={isActive} handleActive={setIsActive} lower={lower} setLower={setLower}/>
              </Grid2>
              <Grid2 size={4} display='flex' justifyContent='center' pt={3}>
                <Stop isActive={isActive} handleActive={setIsActive} resetSignals={resetSignals}/>
              </Grid2>
            </Grid2>

            {/* Schedule */}
            <Grid2>
              <Grid2 size={4} display='flex'>
                <Typography color='textPrimary' variant='h4'>Current Schedule</Typography>
              </Grid2>
              <Grid2 size={4} display='flex' justifyContent='center' pt={3} flexDirection='column' alignItems='center' rowGap={4}>
                <Grid2>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      value={date}
                      onChange={(newValue) => setDate(newValue)}
                    />
                    <TimePicker
                      // label='Raise'
                      // name='Raise'
                      // value={date}
                      // onChange={(newValue) => setDate(newValue)}
                    />
                  </LocalizationProvider>
                </Grid2>
                <Grid2>
                  <ToggleButtonGroup
                    value={formats}
                    onChange={handleFormat}
                    color="primary"
                    aria-label="text formatting"
                  >
                    <ToggleButton value="Monday" aria-label="Monday">
                      M
                    </ToggleButton>
                    <ToggleButton value="italic" aria-label="italic">
                      T
                    </ToggleButton>
                    <ToggleButton value="underlined" aria-label="underlined">
                      W
                    </ToggleButton>
                    <ToggleButton value="color" aria-label="color">
                      TH
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid2>
                <Grid2>
                    <SaveSchedule date={date} />
                </Grid2>
              </Grid2>
              <Grid2 size={4} display='flex' justifyContent='center' pt={3}>
                <Button 
                  variant='contained' 
                  startIcon={<Lock />} 
                  onClick={handleOpen}
                  fullWidth
                >
                  Lock Blinds
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
      </Container>
    </Route>
  );
};
