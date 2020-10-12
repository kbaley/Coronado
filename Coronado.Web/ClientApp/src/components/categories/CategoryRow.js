import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { Grid } from '@material-ui/core';
import * as widths from './CategoryWidths';
import GridRow from '../common/grid/GridRow';
import GridItem from '../common/grid/GridItem';

export function CategoryRow({ category, onEdit, onDelete, parent }) {
  return (
    <GridRow xs={12}>
      <Grid item xs={widths.ICON_WIDTH}>
        <EditIcon onStartEditing={onEdit} fontSize="small" />
        <DeleteIcon onDelete={onDelete} fontSize="small" />
      </Grid>
      <GridItem xs={widths.NAME_WIDTH}>{category.name}</GridItem>
      <GridItem xs={widths.TYPE_WIDTH}>{category.type}</GridItem>
      <GridItem xs={widths.PARENT_WIDTH}></GridItem>
    </GridRow>
  );
}