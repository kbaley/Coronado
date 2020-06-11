import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as navListActions from '../../actions/navListActions'
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const styles = theme => ({
  background: {
    backgroundColor: theme.palette.blue,
  }
});

const useStyles = makeStyles(styles);

export default function ToggleAllAccounts() {
  const dispatch = useDispatch();
  const showAllAccounts = useSelector(state => state.showAllAccounts);

  const toggle = () => {
    dispatch(navListActions.toggleAllAccounts());
  }

    const classes = useStyles();
    var text = showAllAccounts ? "Hide inactive" : "Show all"
    return (
        <Button onClick={toggle} className={classes.background} size="small">
          {text}
        </Button>
    );
}