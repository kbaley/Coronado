import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { TableRow, TableCell, makeStyles } from '@material-ui/core';

import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles)

export function CustomerRow({customer, onEdit, onDelete}) {
  const classes = useStyles();
  return (
    <TableRow className={classes.tableBodyRow}>
      <TableCell className={classes.tableCell}>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
      </TableCell>
      <TableCell className={classes.tableCell}>{customer.name}</TableCell>
      <TableCell className={classes.tableCell}>{customer.email}</TableCell>
      <TableCell className={classes.tableCell}>{customer.streetAddress}</TableCell>
      <TableCell className={classes.tableCell}>{customer.city}</TableCell>
      <TableCell className={classes.tableCell}>{customer.region}</TableCell>
    </TableRow>
  );
}