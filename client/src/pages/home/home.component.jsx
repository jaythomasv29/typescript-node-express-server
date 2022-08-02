import { Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Outlet } from 'react-router-dom';
import ClippedDrawer from '../../components/drawer/drawer.component'



export default function Home() {
  return (
    <Box sx={{ display: 'flex' }}>
      <ClippedDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        
          <Outlet />
      </Box>
    </Box>
  );
}
