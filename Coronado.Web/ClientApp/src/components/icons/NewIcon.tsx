import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IconButton, makeStyles } from '@material-ui/core';

const styles = (theme: any) => ({
  icon: {
    color: theme.palette.green,
  }
})

interface NewIconProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    fontSize: any;
}

const useStyles = makeStyles(styles);

export function NewIcon({onClick, fontSize, ...rest}: NewIconProps) {
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
