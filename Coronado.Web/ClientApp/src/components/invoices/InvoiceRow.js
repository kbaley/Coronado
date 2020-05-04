import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { NullableDate } from '../common/NullableDate';
import { Icon } from '../icons/Icon';
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";
import { makeStyles } from '@material-ui/core/styles';
import { TableRow, TableCell } from '@material-ui/core';

const useStyles = makeStyles(styles);

export function InvoiceRow({invoice, onEdit, onDelete, onDownload, onEmail, onPreview}) {
  const classes = useStyles();
  return (
    <TableRow className={classes.tableBodyRow}>
      <TableCell className={classes.tableCell}>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
        <Icon onClick={onDownload} glyph="file-download" title="Download" />
        <Icon onClick={onEmail} glyph="envelope" title="Email" />
        <Icon onClick={onPreview} glyph="external-link-alt" title="Preview" />
      </TableCell>
      <TableCell className={classes.tableCell}>{invoice.invoiceNumber}</TableCell>
      <TableCell className={classes.tableCell}>{new Date(invoice.date).toLocaleDateString()}</TableCell>
      <TableCell className={classes.tableCell}>{invoice.customerName} ({invoice.customerEmail})</TableCell>
      <TableCell className={classes.tableCell}><NullableDate date={invoice.lastSentToCustomer} /></TableCell>
      <TableCell className={classes.tableCell}><CurrencyFormat value={invoice.balance} /></TableCell>
    </TableRow>
  );
}