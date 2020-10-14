import React from 'react';
import { DecimalFormat, MoneyFormat } from '../common/DecimalFormat';
import { IconButton, makeStyles, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import * as widths from './TransactionWidths';
import GridRow from '../common/grid/GridRow';
import GridItem from '../common/grid/GridItem';
import EditableTransaction from './EditableTransaction';
import * as Mousetrap from 'mousetrap';

const styles = theme => ({
  icon: {
    transform: "scale(1)",
  },
  row: {
    padding: '7px 5px',
    "&:hover": {
      cursor: 'pointer',
    },
  },
  gridRow: {
    "&:hover": {
      backgroundColor: theme.palette.gray[1],
    },
  },
  button: {
    padding: 7,
  }
});

function ClickableGridItem({ children, onClick, ...other }) {
  const classes = useStyles();
  return (
    <GridItem
      {...other}
      className={classes.row}
      onClick={onClick}
    >
      {children}
    </GridItem>
  )
}

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

  const startEditing = () => {
    setIsEditing(true);
    Mousetrap.bind('esc', cancelEditing)
  }

  const cancelEditing = () => {
    setIsEditing(false);
    Mousetrap.unbind('esc');
  }

  const classes = useStyles();

  return (
    isEditing ?
      <EditableTransaction 
        transaction={trx} 
        onCancelEdit={cancelEditing}
        onFinishEdit={cancelEditing}
      /> :

      <GridRow xs={12} className={classes.gridRow}>
        <Grid item xs={widths.ICON_WIDTH}>
          <IconButton onClick={props.onDelete} component="span" className={classes.button}>
            <DeleteIcon className={classes.icon} fontSize="small" />
          </IconButton>
        </Grid>
        <ClickableGridItem 
          xs={widths.DATE_WIDTH}
          onClick={startEditing}
        >
          {new Date(trx.transactionDate).toLocaleDateString()}
        </ClickableGridItem>
        <ClickableGridItem 
          xs={widths.VENDOR_WIDTH}
          onClick={startEditing}
        >
          {trx.vendor}
        </ClickableGridItem>
        <ClickableGridItem 
          xs={widths.CATEGORY_WIDTH}
          onClick={startEditing}
        >
          {trx.categoryDisplay}
        </ClickableGridItem>
        <ClickableGridItem 
          xs={widths.DESCRIPTION_WIDTH}
          onClick={startEditing}
        >
          {trx.description}
        </ClickableGridItem>
        <ClickableGridItem 
          xs={widths.DEBIT_WIDTH}
          onClick={startEditing}
        >
          <DecimalFormat isDebit={true} amount={trx.debit} />
        </ClickableGridItem>
        <ClickableGridItem 
          xs={widths.CREDIT_WIDTH}
          onClick={startEditing}
        >
          <DecimalFormat isDebit={true} amount={trx.credit} />
        </ClickableGridItem>
        <ClickableGridItem 
          xs={widths.BALANCE_WIDTH}
          onClick={startEditing}
        >
          <MoneyFormat amount={trx.runningTotal} />
        </ClickableGridItem>
      </GridRow>
  );
}
