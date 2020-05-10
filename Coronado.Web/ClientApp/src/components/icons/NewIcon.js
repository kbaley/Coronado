import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IconButton, makeStyles } from '@material-ui/core';
import { PropTypes } from 'prop-types';

const styles = theme => ({
  icon: {
    color: theme.palette.green,
  }
})

const useStyles = makeStyles(styles);

export function NewIcon({onClick, fontSize, ...rest}) {
  const classes = useStyles();
  return (
    <IconButton onClick={onClick} component="span" {...rest}>
      <AddCircleIcon 
        className={classes.icon}
        fontSize={fontSize ?? "default"}
      />
    </IconButton>
  );
}

NewIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  fontSize: PropTypes.string
}