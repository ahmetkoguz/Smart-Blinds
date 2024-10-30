import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { useState } from "preact/hooks";

export const PinDialog = (props) => {
  const [pin, setPIN] = useState(1234); // test harcoded pin for demo

  const onPINChange = (event) => {
    console.log(event.target.value);

    if(pin == null && event.target.value.length == 4) {
      setPIN(event.target.value);
      props.handleClose();
    } 
    else if(event.target.value == pin) {
      props.handleClose();
    }
    else if(pin != null && event.target.value.length == 4 && event.target.value != pin) {
      console.log("incorrect pin");
    }
  }
  
return (
    <Dialog open={props.pinDialogOpen} disableRestoreFocus slotProps={{ backdrop: { style: { backgroundColor: "white" } } }} >
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