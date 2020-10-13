import React from 'react';
import { DecimalFormat, MoneyFormat } from '../common/DecimalFormat';
import { IconButton, makeStyles, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import * as widths from './TransactionWidths';
import GridRow from '../common/grid/GridRow';
import GridItem from '../common/grid/GridItem';
import EditableTransaction from './EditableTransaction';

const styles = theme => ({
  icon: {
    transform: "scale(1)",
  }
});

const useStyles = makeStyles(styles);

export default function TransactionRow(props) {
  const [isEditing, setIsEditing] = React.useState(false);
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
    isEditing ?
      <EditableTransaction 
        transaction={trx} 
        onCancelEdit={() => setIsEditing(false)}
        onFinishEdit={() => setIsEditing(false)}
      /> :

      <GridRow xs={12}>
        <Grid item xs={widths.ICON_WIDTH}>
          <IconButton onClick={() => setIsEditing(true)} component="span">
            <EditIcon className={classes.icon} fontSize="small" />
          </IconButton>
          <IconButton onClick={props.onDelete} component="span">
            <DeleteIcon className={classes.icon} fontSize="small" />
          </IconButton>
        </Grid>
        <GridItem xs={widths.DATE_WIDTH}>{new Date(trx.transactionDate).toLocaleDateString()}</GridItem>
        <GridItem xs={widths.VENDOR_WIDTH}>{trx.vendor}</GridItem>
        <GridItem xs={widths.CATEGORY_WIDTH}>{trx.categoryDisplay}</GridItem>
        <GridItem xs={widths.DESCRIPTION_WIDTH}>{trx.description}</GridItem>
        <GridItem xs={widths.DEBIT_WIDTH}><DecimalFormat isDebit={true} amount={trx.debit} /></GridItem>
        <GridItem xs={widths.CREDIT_WIDTH}><DecimalFormat isCredit={true} amount={trx.credit} /></GridItem>
        <GridItem xs={widths.BALANCE_WIDTH}><MoneyFormat amount={trx.runningTotal} /></GridItem>
      </GridRow>
  );
}
