import { Box, Container, Grid2, Typography } from "@mui/material";
import { Lower } from "./views/lower";
import { Raise } from "./views/raise";
import { Stop } from "./views/stop";
import { useState } from "react";
import { Route } from "wouter";

export const App = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Route path="/">
      <Container>
        <Grid2 container rowSpacing='65px' sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
          <Grid2 size={12} display='flex' justifyContent='center'>
            <Typography color='primary' fontSize='3.25rem' variant='h2'>Smart Blinds</Typography>
          </Grid2>
          <Grid2>
            <Grid2 size={4} display='flex' pb='22px'>
              <Typography color='textPrimary' variant='h4'>Current Status</Typography>
            </Grid2>
            <Grid2 size={4} display='flex' justifyContent='center' columnGap='60px'>
              <Raise isActive={isActive} handleActive={setIsActive}/>
              <Lower isActive={isActive} handleActive={setIsActive}/>
            </Grid2>
            <Grid2 size={4} display='flex' justifyContent='center' pt={3}>
              <Stop isActive={isActive} handleActive={setIsActive}/>
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    </Route>
  );
};
