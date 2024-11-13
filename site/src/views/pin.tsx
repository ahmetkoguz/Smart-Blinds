import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { useState, useEffect } from "preact/hooks";

export const PinDialog = (props) => {
  const [pin, setPIN] = useState(); // test harcoded pin for demo

    useEffect(() => {
        // Trigger backend endpoint, sending http get request
        fetch("/api/pin")
            .then((res) => res.json().then(val => {
                setPIN(val?.pin);
            })), {
                method: 'GET'
            }
    }, []);

  const onPINChange = (event) => {
    if((pin == null || props.edit) && event.target.value.length == 4) {
      setPIN(event.target.value);
      let pin = event.target.value;

      fetch("/api/pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      props.setEdit(false);
      props.handleClose();
    } 
    else if(event.target.value == pin || event.target.value == 1234) { // Added as extra admin access
      props.handleClose();
    }
    else if(pin != null && event.target.value.length == 4 && event.target.value != pin) {
      console.log("incorrect pin");
    }
  }
  
return (
    <Dialog open={props.pinDialogOpen} disableRestoreFocus slotProps={{ backdrop: { style: { backgroundColor: "white" } } }} >
      <DialogTitle>{props.edit ? "Edit PIN" : "Enter PIN"}</DialogTitle><DialogContent>
      <DialogContentText>
        {props.edit ? "Enter your desired PIN to use for access." : "To gain access to Smart Blinds enter your PIN."}
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