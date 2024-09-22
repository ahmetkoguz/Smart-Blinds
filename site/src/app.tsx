import { Box, Container, Grid2, Typography } from "@mui/material";
import { Led } from "./views/led";

export const App = () => (
  <Container>
    <Grid2 container sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
      <Grid2 size={2}>
        <Typography color='primary'>Smart Blinds</Typography>
      </Grid2>
      <Grid2 size={2}>
        <Led />
      </Grid2>
    </Grid2>
  </Container>
);
