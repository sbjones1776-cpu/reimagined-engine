import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

export default function TopBar({ user, onLogout, onPlayNow }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Logo and App Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/icons/icon-192.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            Math Adventure
          </Typography>
        </Box>
        {/* Center: Play Now button */}
        <Button
          variant="contained"
          color="secondary"
          sx={{ fontWeight: 700, px: 3, boxShadow: 2 }}
          onClick={onPlayNow}
          component={Link}
          to="/home"
        >
          Play Now
        </Button>
        {/* Right: Email and Avatar/Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            {user?.email}
          </Typography>
          <IconButton onClick={handleMenu} size="large" sx={{ ml: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem component={Link} to="/avatar" onClick={handleClose}>Profile</MenuItem>
            <MenuItem component={Link} to="/settings" onClick={handleClose}>Settings</MenuItem>
            <MenuItem component={Link} to="/subscription" onClick={handleClose}>Subscription</MenuItem>
            <MenuItem component={Link} to="/privacypolicy" onClick={handleClose}>Privacy Policy</MenuItem>
            {user?.is_admin && <MenuItem component={Link} to="/admintestaccount" onClick={handleClose}>Admin</MenuItem>}
            <MenuItem onClick={() => { handleClose(); onLogout(); }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
