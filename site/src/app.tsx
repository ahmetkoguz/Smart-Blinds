import { Button, Container, Grid2, IconButton, Icon, Tooltip, Typography } from "@mui/material";
import { Lower } from "./views/lower";
import { Raise } from "./views/raise";
import { Stop } from "./views/stop";
import { useState } from "preact/hooks";
import { Route } from "wouter";
import { Edit, InfoOutlined, Lock } from "@mui/icons-material";
import { Scheduler } from "./views/scheduler";
import { PinDialog } from "./views/pin";
import Logo from "./Blind_Guys.svg";

export const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [edit, setEdit] = useState(false);
  const [raise, setRaise] = useState(false);
  const [lower, setLower] = useState(false);

  const [pinDialogOpen, setPinDialogOpen] = useState(true);

  const handleOpen = () => {
    setPinDialogOpen(true);
  };

  const handleEdit = () => {
    setEdit(true);
    setPinDialogOpen(true);
  };

  const handleClose = () => {
    setPinDialogOpen(false);
  };


  const resetSignals = () => {
    setLower(false);
    setRaise(false);
  }

  return (
    <Route path="/">
      <Container maxWidth='sm'>
        <PinDialog pinDialogOpen={pinDialogOpen} handleClose={handleClose} edit={edit} setEdit={setEdit}/>
          <Grid2 container rowSpacing='50px' sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
            {/* Title */}
            <Grid2 pt={1} size={12} display='flex' justifyContent='center'>
              <Typography pr={0.5} color='primary' fontSize='3rem' variant='h2'>Smart Blinds</Typography>
              <Icon sx={{ fontSize: 55 }}>
                <img src={Logo} height={100} width={100} />
              </Icon>
            </Grid2>

            {/* Status */}
            <Grid2>
              <Grid2 size={4} display='flex' pb='22px'>
                <Typography color='textPrimary' variant='h4' fontSize="30px">Current Status</Typography>
                <Tooltip 
                  enterTouchDelay={0}
                  leaveTouchDelay={3000}  
                  title='Press raise, lower or stop to manually control blinds'
                >
                  <IconButton><InfoOutlined /></IconButton>
                </Tooltip>
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
                <Typography color='textPrimary' variant='h4' fontSize="30px">Current Schedule</Typography>
                <Tooltip 
                  enterTouchDelay={0}
                  leaveTouchDelay={3000}  
                  title='Blinds will be lowered and raised automatically on days and time selected'
                >
                  <IconButton><InfoOutlined /></IconButton>
                </Tooltip>
              </Grid2>
              <Grid2 size={4} display='flex' justifyContent='center' pt={3} flexDirection='column' alignItems='center' rowGap={4}>
                <Scheduler/>
              </Grid2>
            </Grid2>

            {/* Misc */}
            <Grid2>
              <Grid2 size={2} display='flex' justifyContent='center'>
                <Button 
                  variant='contained' 
                  startIcon={<Lock />} 
                  onClick={handleOpen}
                  fullWidth
                >
                  Lock Blinds
                </Button>
              </Grid2>
              <Grid2 size={2} display='flex' justifyContent='center' pt={3} pb={5}>
                <Button 
                  variant='contained' 
                  startIcon={<Edit />} 
                  onClick={handleEdit}
                  fullWidth
                >
                  Edit PIN 
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
      </Container>
    </Route>
  );
};
