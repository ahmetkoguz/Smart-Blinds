import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid2, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Lower } from "./views/lower";
import { Raise } from "./views/raise";
import { Stop } from "./views/stop";
import { useState } from "preact/hooks";
import { Route } from "wouter";
import { Lock, Schedule } from "@mui/icons-material";
import { Scheduler } from "./views/scheduler";

export const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [raise, setRaise] = useState(false);
  const [lower, setLower] = useState(false);

  const [pin, setPIN] = useState(1234); // test harcoded pin for demo
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
    <Dialog open={pinDialogOpen} disableRestoreFocus slotProps={{ backdrop: { style: { backgroundColor: "white" } } }} >
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
        inputProps={{ maxLength: 4, inputMode: 'numeric' }}
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
                <Scheduler/>
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
