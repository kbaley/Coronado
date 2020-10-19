import React from 'react';
import { MoneyFormat, MiniDecimalFormat } from '../../common/DecimalFormat';
import { Grid, makeStyles } from '@material-ui/core';

const styles = theme => ({
  icon: {
    transform: "scale(1)",
  },
  row: {
    padding: '7px 5px',
  },
  gridRow: {
    padding: 7,
    fontSize: 14,
    color: "#263238",
    borderBottom: "1px solid #ddd",
  },
  button: {
    padding: 7,
  },
  description: {
    color: "#a9afbb",
  },
});

const useStyles = makeStyles(styles);

export default function MiniTransactionRow(props) {
  const [trx, setTrx] = React.useState({
    ...props.transaction,
    vendor: props.transaction.vendor || '',
    description: props.transaction.description || '',
    transactionDate: new Date(props.transaction.transactionDate).toLocaleDateString(),
    categoryId: (props.transaction.transactionType === 0) ? props.transaction.categoryId : '',
    debit: props.transaction.debit ? Number(props.transaction.debit).toFixed(2) : '',
    credit: props.transaction.credit ? Number(props.transaction.credit).toFixed(2) : '',
    categoryName: props.transaction.categoryDisplay,
  });

  React.useEffect(() => {
    var transaction = props.transaction;
    if (transaction) {
      setTrx({
        ...transaction,
        vendor: transaction.vendor || '',
        description: transaction.description || '',
        transactionDate: new Date(transaction.transactionDate).toLocaleDateString(),
        categoryId: (transaction.transactionType === 0) ? transaction.categoryId : '',
        debit: transaction.debit ? Number(transaction.debit).toFixed(2) : '',
        credit: transaction.credit ? Number(transaction.credit).toFixed(2) : '',
        categoryName: transaction.categoryDisplay,
      });
    }
  }, [props.transaction]);

  const classes = useStyles();

  return (
      <Grid item container spacing={0} xs={12} className={classes.gridRow}>
        <Grid item xs={3}>{trx.vendor}</Grid>
        <Grid item xs={3}>{trx.categoryDisplay}</Grid>
        <Grid item xs={3}><MiniDecimalFormat amount={trx.amount} /></Grid>
        <Grid item xs={3}><MoneyFormat amount={trx.runningTotal} /></Grid>
        <Grid item xs={1} />
        <Grid item xs={11} className={classes.description}>{trx.description}</Grid>
      </Grid>
  );
}
