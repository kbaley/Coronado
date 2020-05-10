import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { TableRow, TableCell, makeStyles } from '@material-ui/core';

const style = theme => ({
  editCell: {
    width: 110,
  }
})

const useStyles = makeStyles(style);

export function CategoryRow({category, onEdit, onDelete, parent}) {
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell className={classes.editCell}>
        <EditIcon onStartEditing={onEdit} fontSize="small"/>
        <DeleteIcon onDelete={onDelete} fontSize="small" />
      </TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.type}</TableCell>
      <TableCell>{parent}</TableCell>
    </TableRow>
  );
}