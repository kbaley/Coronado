import React from 'react';
import * as transactionActions from '../../actions/transactionActions';
import { useDispatch, useSelector } from 'react-redux';
import TransactionRow from './TransactionRow';
import NewTransactionRow from './NewTransactionRow';
import { Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import Spinner from '../common/Spinner';

const styles = theme => ({
  transactionTable: {
    width: "100%",
    "& td": {
      padding: "0px",
    },
    "& td:nth-child(1)": {
      width: 55,
      maxWidth: 55,
    },
    "& td:nth-child(2)": {
      width: 110,
      maxWidth: 110,
    },
    "& td:nth-child(3)": {
      width: 200,
      maxWidth: 200,
    },
    "& td:nth-child(4)": {
      width: 280,
      maxWidth: 280,
    },
    "& td:nth-child(5)": {
      width: 'auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: 0,
    },
    "& td:nth-child(6), & td:nth-child(7), & td:nth-child(8)": {
      width: 100,
      maxWidth: 100,
    },
    "& input": {
      width: "100%",
    }
  }
})

const useStyles = makeStyles(styles);

export default function TransactionList(props) {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactionModel.transactions);
  const isLoading = useSelector(state => state.loading.transactions);

  const deleteTransaction = (transactionId) => {
    dispatch(transactionActions.deleteTransaction(transactionId));
  }

  const classes = useStyles();

  return (
    <Table className={classes.transactionTable}>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Vendor</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Debit</TableCell>
          <TableCell>Credit</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <NewTransactionRow
          account={props.account} />
        {isLoading ? <tr><td colSpan="8"><Spinner /></td></tr> :
          transactions.map(trx =>
            <TransactionRow 
              key={trx.transactionId} 
              transaction={trx}
              isEditing={trx.isEditing}
              onDelete={() => deleteTransaction(trx.transactionId)} />
          )
        }
      </TableBody>
    </Table>
  );
}