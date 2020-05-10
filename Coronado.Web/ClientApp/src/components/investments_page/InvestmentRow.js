import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { Icon } from '../icons/Icon';
import { MoneyFormat } from '../common/DecimalFormat';
import { TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HistoryIcon from '@material-ui/icons/History';

const styles = theme => ({
  row: {
    "& td": {
      padding: 0,
    }
  }
})

const useStyles = makeStyles(styles);
export function InvestmentRow({investment, onEdit, onDelete, openPriceHistory}) {
  const classes = useStyles(); 
  return (
    <TableRow className={classes.row}>
      <TableCell>
      <EditIcon onStartEditing={onEdit} fontSize="small" />
      <DeleteIcon onDelete={onDelete} fontSize="small" />
      <Icon 
        onClick={openPriceHistory} 
        title="Show historical prices" 
        icon={<HistoryIcon fontSize="small" />}
      />
      </TableCell>
      <TableCell>{investment.name}</TableCell>
      <TableCell>{investment.symbol}</TableCell>
      <TableCell>{investment.currency}</TableCell>
      <TableCell>{investment.shares}</TableCell>
      <TableCell><MoneyFormat amount={investment.lastPrice} /></TableCell>
      <TableCell><MoneyFormat amount={investment.currentValue} /></TableCell>
    </TableRow>
  );
}