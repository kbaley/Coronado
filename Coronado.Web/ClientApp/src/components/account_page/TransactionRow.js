import React from 'react';
import { DecimalFormat, MoneyFormat } from '../common/DecimalFormat';
import { IconButton, makeStyles, TableCell, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditableTransaction from './EditableTransaction';
import Moment from 'react-moment';
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
    padding: 5,
  }
});

function ClickableTableCell({ children, onClick, ...other }) {
  const classes = useStyles();
  return (
    <TableCell
      {...other}
      className={classes.row}
      onClick={onClick}
    >
      {children}
    </TableCell>
  )
}

const useStyles = makeStyles(styles);

export default function TransactionRow(props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [trx, setTrx] = React.useState({
    ...props.transaction,
    vendor: props.transaction.vendor || '',
    description: props.transaction.description || '',
    transactionDate: new Date(props.transaction.transactionDate),
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
        transactionDate: new Date(transaction.transactionDate),
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

      <TableRow className={classes.gridRow}>
        <TableCell>
          <IconButton onClick={props.onDelete} component="span" className={classes.button}>
            <DeleteIcon className={classes.icon} fontSize="small" />
          </IconButton>
        </TableCell>
        <ClickableTableCell onClick={startEditing}>
          <Moment format="MM/DD/YYYY">{trx.transactionDate}</Moment>
        </ClickableTableCell>
        <ClickableTableCell onClick={startEditing}>
          {trx.vendor}
        </ClickableTableCell>
        <ClickableTableCell onClick={startEditing}>
          {trx.categoryDisplay}
        </ClickableTableCell>
        <ClickableTableCell onClick={startEditing} title={trx.description}>
          {trx.description}
        </ClickableTableCell>
        <ClickableTableCell onClick={startEditing}>
          <DecimalFormat isDebit={true} amount={trx.debit} />
        </ClickableTableCell>
        <ClickableTableCell onClick={startEditing}>
          <DecimalFormat isDebit={true} amount={trx.credit} />
        </ClickableTableCell>
        <ClickableTableCell onClick={startEditing}>
          <MoneyFormat amount={trx.runningTotal} />
        </ClickableTableCell>
      </TableRow>
  );
}
