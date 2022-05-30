import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { PaperComponent } from "./ConfirmDialog";
import { alertService } from "./service/message.service";

export default function AlertDialog() {

    useEffect(() => {
        let subscription = alertService.getMessage().subscribe(message => {
            if (message) {
                // add message to local state if not empty
                setOpen(true);
                setOnConfirm(message);
            } else {
                // clear messages when empty message received
            }
        });
        return () => {
            subscription.unsubscribe();
        }
    });
    const [open, setOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState(null);
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {onConfirm?.state}
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{whiteSpace: 'pre-wrap'}}>
                    {onConfirm?.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>확인 </Button>
            </DialogActions>
        </Dialog>
    );

}