import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { Icon } from '../icons/Icon';
import { MoneyFormat } from '../common/DecimalFormat';
import { TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  row: {
    "& td": {
      padding: 0,
    }
  }
})

const useStyles = makeStyles(styles);
export function InvestmentRow({investment, onEdit, onDelete, openPriceHistory, onBuySell}) {
  const classes = useStyles(); 
  return (
    <TableRow className={classes.row}>
      <TableCell>
      <EditIcon onStartEditing={onEdit} fontSize="small" />
      <DeleteIcon onDelete={onDelete} fontSize="small" />
      <Icon 
        onClick={onBuySell} 
        title="Buy/sell shares in this investment" 
        icon={<AddIcon fontSize="small" />}
      />
      </TableCell>
      <TableCell>{investment.name}</TableCell>
      <TableCell>{investment.symbol}</TableCell>
      <TableCell>{investment.currency}</TableCell>
      <TableCell>{investment.shares}</TableCell>
      <TableCell><MoneyFormat amount={investment.lastPrice} /></TableCell>
      <TableCell><MoneyFormat amount={investment.averagePrice} /></TableCell>
      <TableCell><MoneyFormat amount={investment.currentValue} /></TableCell>
    </TableRow>
  );
}