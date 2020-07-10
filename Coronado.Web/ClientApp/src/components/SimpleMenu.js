import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import { withWidth, Typography } from '@material-ui/core';

function SimpleMenu(props) {
  console.log(props);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Box clone display={{ lg: "none" }}>
        <Typography variant="h1">No small</Typography>
      </Box>
      <Box>
        <Typography variant="h1">All</Typography>
      </Box>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box clone display={{ sm: "none" }}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Box>
        <Box clone display={{ lg: "none" }}>
          <MenuItem onClick={handleClose}>My account</MenuItem>
        </Box>
        <Box clone display={{ md: "none" }}>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Box>
      </Menu>
    </div>
  );
}

export default withWidth()(SimpleMenu);