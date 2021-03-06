import React from 'react';
import NavBar from './NavBar';
import './Layout.css';
import NotificationsComponent from './Notifications';
import ShortcutHelper from './common/ShortcutHelper';
import Sidebar from './Sidebar/Sidebar';
import { makeStyles } from '@material-ui/core/styles';

const styles = theme => ({

  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - 350px)`
    },
    float: "right",
    width: "100%",
  },
  content: {
    padding: "0 15px 30px",
    minHeight: "calc(100vh - 123px)"
  },
});

const useStyles = makeStyles(styles);

export default function Layout(props) {
  const [ sidebarOpen, setSidebarOpen ] = React.useState(false);
  const classes = useStyles();
  const onSidebarOpen = () => {
    setSidebarOpen(true);
  }
  const onSidebarClosed = () => {
    setSidebarOpen(false);
  }
  return (
    <div>
      <Sidebar 
        open={sidebarOpen}
        onSidebarClosed={onSidebarClosed}
      />
      <div className={classes.mainPanel}>
        <NavBar 
          onSidebarOpen={onSidebarOpen}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            {props.children}
          </div>
        </div>
      </div>
      <NotificationsComponent />
      <ShortcutHelper />
    </div>
  );
};
