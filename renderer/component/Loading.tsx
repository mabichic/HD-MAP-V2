import { CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/system';
import * as React from 'react';
import { loadingService } from './service/message.service';

export default function Loading() {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    let subscription = loadingService.getMessage().subscribe(msg => {
        setLoading(msg.state);
    });
    return () => {
      subscription.unsubscribe();
    }
  });
  return (
    <div>
      <Dialog open={loading}>
        <Box sx={{overflow:"hidden", backgroundColor:"transparent"}}>
            <CircularProgress size={100} />
        </Box>
      </Dialog>
    </div>
  );
}