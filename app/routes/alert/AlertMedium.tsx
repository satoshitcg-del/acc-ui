import * as React from 'react';
import { Alert, Typography, Snackbar, Stack, Box } from "@mui/material";

export default function Component(data: any) {
    // const {message, status, success} = data.signInAlert
    const [open, setOpen] = React.useState(false);
    let severity = data.signInAlert.success == "false" ? "error" : "success"
  
    React.useEffect(() => {
        if (data?.signInAlert && data?.signInAlert?.message?.length > 0) {
            setOpen(true)
        }
    }, [data?.signInAlert]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
  
    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open}  onClose={handleClose} autoHideDuration={4000}>  
            <Alert className='flex items-center' onClose={handleClose} severity={severity as any} sx={{ width: '100%' }}>
              <Typography className='text-2xl leading-none pb-1'>
                {data?.signInAlert?.message}
              </Typography>
            </Alert>
         </Snackbar>
      </Stack> 
    );
}
Component.displayName = "AlertMedium";