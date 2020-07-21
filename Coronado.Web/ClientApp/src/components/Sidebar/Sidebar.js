import React from 'react';
import AccountNavList from './AccountNavList';
import { Drawer, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';

const drawerWidthWide = 350;
const drawerWidthNarrow = 250;
const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidthWide,
    },
    [theme.breakpoints.down("xs")]: {
      width: drawerWidthNarrow,
    },
    backgroundColor: theme.palette.blue,
  },
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
}));

export default function Sidebar({open, onSidebarClosed}) {
  const [ mobileOpen, setMobileOpen ] = React.useState(open);
  const classes = useStyles();

  React.useEffect(() => {
    setMobileOpen(open); 
  }, [open]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    onSidebarClosed();
  }

  const onAccountSelected = () => {
    handleDrawerToggle();
  }

  return (localStorage.getItem('coronado-user') &&
  <nav>
   <Hidden mdUp>
      <Drawer
        variant="temporary"
        classes={{ paper: classes.drawer }}
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        <div className={classes.root}>
          <Header />
          <AccountNavList 
            onItemSelected={onAccountSelected}
          />
        </div>
      </Drawer>
   </Hidden>
    <Hidden smDown>
      <Drawer
        variant="permanent"
        classes={{ paper: classes.drawer }}
        anchor="left"
        open
      >
        <div className={classes.root}>
          <Header />
          <AccountNavList />
        </div>
      </Drawer>
    </Hidden>
    </nav>
  );
};

Sidebar.propTypes = {
};
