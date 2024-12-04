import React, { useState, useRef } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  History as HistoryIcon,
  Logout as LogoutIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, useTheme } from '@mui/material/styles';
import RouteIcon from '@mui/icons-material/Route';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';

const drawerWidth = 270;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
 
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  marginBottom: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const AppBarShift = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Sidebar = ({ savedRoutes, setSavedRoutes }) => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');


  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuOpen = (event, trip) => {
    console.log('Menu opened for trip:', trip); // Debugging line
    event.stopPropagation(); 
    setAnchorEl(event.currentTarget);
    setSelectedTrip(trip);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGenerateNewTrip = () => {
    navigate('/generate');
    setOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleDeleteRoute = async (tripId) => {
    try {
      console.log('Deleting trip with ID:', tripId); // Debugging line
      await deleteDoc(doc(db, 'routes', tripId));
      setSavedRoutes((prevRoutes) => {
        const updatedRoutes = prevRoutes.filter((route) => route.id !== tripId);

        // Find the index of the current route
        const currentIndex = prevRoutes.findIndex((route) => route.id === tripId);
        // Check if the current route is the one being viewed
        if (location.pathname.includes(`/generated-trip/new/${currentIndex}`)) {
          if (updatedRoutes.length > 0) {
            // Redirect to the next route if available
            const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            navigate(`/generated-trip/new/${nextIndex}`);
          } else {
            navigate('/generate');
          }
        }

        return updatedRoutes;
      });
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const handleRenameRoute = async (tripId) => {
    if (!tripId) {
      console.error("Invalid tripId");
      return;
    }
    try {
      console.log("Renaming trip with ID:", tripId); // Debugging log
      await updateDoc(doc(db, 'routes', tripId), { routeName: newRouteName });
      setSavedRoutes((prevRoutes) =>
        prevRoutes.map((route) =>
          route.id === tripId ? { ...route, routeName: newRouteName } : route
        )
      );
      handleRenameDialogClose();
    } catch (error) {
      console.error('Error renaming route: ', error);
    }
  };

  const handleRenameClick = () => {
    console.log('Rename clicked for trip:', selectedTrip); // Debugging line
    setNewRouteName(selectedTrip?.routeName || '');
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameDialogClose = () => {
    setRenameDialogOpen(false);
  };

  const handleRouteClick = (index) => {
    navigate(`/generated-trip/new/${index}`);
    setOpen(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <AppBarShift sx={{  backgroundColor: 'transparent', boxShadow: 'none' }} position="fixed" open={open}>
        <Toolbar >
          <span style={{ fontSize: '20px' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ color: '#143A6F', mr: 3, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
          </span>
          <div>
            <div style={{ margin: 0, padding: 0 }}>
              <span style={{fontSize:30}} className="walki-text playfair-display-semi-bold">Weavo</span><span className='ai-text' style={{fontSize:15, marginLeft:3}}>ai</span>
            </div>
          </div>
        </Toolbar>
      </AppBarShift>
      <Drawer 
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            color: '#143A6F',
            borderRadius: '15px',
            backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.4)',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <DrawerHeader >
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </DrawerHeader>
          <Box sx={{ flexGrow: 0}}>
            <List>
              <ListItem button onClick={handleGenerateNewTrip}>
                <ListItemIcon style={{ color: '#1876D2' }}>
                  <RouteIcon />
                </ListItemIcon>
                <ListItemText primary="Generate New Trip" />
              </ListItem>
            </List>
          </Box>
          <Divider />
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List component="nav">
              <ListItem button onClick={handleMenuClick}>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Previous Trips" />
                {menuOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={menuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {savedRoutes.map((item, index) => (
                    <ListItem  button key={item.id} onClick={() => handleRouteClick(index)}>
                      <ListItemText  primary={item.routeName} />
                      <IconButton onClick={(event) => handleMenuOpen(event, item)}>
                        <MoreVertIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </List>
          </Box>
          <Divider />
          <Box sx={{ flexGrow: 0 }}>
            <List>
              <ListItem button onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem  sx={{ 
        
        '&::before': { display: 'none' }
      }} onClick={() => handleDeleteRoute(selectedTrip?.id)}>Delete</MenuItem>
        <MenuItem  sx={{ 
        
        '&::before': { display: 'none' }
      }} onClick={() => handleRenameClick()}>Rename</MenuItem>
      </Menu>
      <Dialog
        open={renameDialogOpen}
        onClose={handleRenameDialogClose}
      > 
        <DialogTitle>Rename Route</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a new name for the route.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Route Name"
            type="text"
            fullWidth
            value={newRouteName}
            onChange={(e) => setNewRouteName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleRenameRoute(selectedTrip?.id)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Main open={open}>
        <DrawerHeader />
        <Typography paragraph></Typography>
      </Main>
    </div>
  );
};

export default Sidebar;
