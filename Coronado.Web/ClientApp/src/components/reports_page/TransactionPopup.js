import React from 'react';
import {
  makeStyles,
  Popover,
  Grid
} from '@material-ui/core';
import { MoneyFormat } from '../common/DecimalFormat';

const styles = theme => ({
  root: {
    minWidth: 800,
    width: 800,
    padding: 10,
  }
});

const useStyles = makeStyles(styles);

export default function TransactionPopup({transactions, target, onClose}) {

  const [ anchorEl, setAnchorEl ] = React.useState(target);

  React.useEffect(() => {
    setAnchorEl(target);
  }, [target]);

  const handleClosePopup = () => {
    setAnchorEl(null);
    onClose();
  }

  const classes = useStyles();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopup}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {transactions && transactions.map(t => 
          <div
            key={t.transactionId}
            className={classes.root}
          >
          <Grid 
            container 
            spacing={2} 
          >
            <Grid item xs={1}>{new Date(t.transactionDate).toLocaleDateString()}</Grid>
            <Grid item xs={3}>{t.vendor}</Grid>
            <Grid item xs={3}>{t.account.name}</Grid>
            <Grid item xs={4}>{t.description}</Grid>
            <Grid item xs={1}><MoneyFormat amount={t.amount} /></Grid>
          </Grid>
          </div>
        )}
      </Popover>
  );
}
