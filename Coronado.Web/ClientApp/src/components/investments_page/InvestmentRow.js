import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { Icon } from '../icons/Icon';
import { MoneyFormat, PercentageFormat } from '../common/DecimalFormat';
import history from "../../history";
import { 
  TableRow, 
  TableCell,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  row: {
    textDecoration: "none",
    "&:hover": {
      cursor: 'pointer',
      backgroundColor: "#eee",
    },
    "& td": {
      padding: 0,
    }
  }
})

const goToInvestment = (investment) => {
  history.push('/investment/'+ investment.symbol);
}

function ClickableTableCell({children, investment}) {
  return (
    <TableCell
        onClick={() => goToInvestment(investment)}
    >
      {children}
    </TableCell>
  );
}

const useStyles = makeStyles(styles);
export function InvestmentRow({investment, onEdit, onDelete, onBuySell}) {
  const classes = useStyles(); 
  return (
    <TableRow 
      className={classes.row}
    >
      <TableCell>
      <EditIcon onStartEditing={onEdit} fontSize="small" />
      <DeleteIcon onDelete={onDelete} fontSize="small" />
      <Icon 
        onClick={onBuySell} 
        title="Buy/sell shares in this investment" 
        icon={<AddIcon fontSize="small" />}
      />
      </TableCell>
      <ClickableTableCell investment={investment}>{investment.name}</ClickableTableCell>
      <ClickableTableCell investment={investment}>{investment.symbol}</ClickableTableCell>
      <ClickableTableCell investment={investment}>{investment.shares}</ClickableTableCell>
      <ClickableTableCell investment={investment}>
        <MoneyFormat amount={investment.lastPrice} />
      </ClickableTableCell>
      <ClickableTableCell investment={investment}>
        <MoneyFormat amount={investment.averagePrice} />
      </ClickableTableCell>
      <ClickableTableCell investment={investment}>
        <PercentageFormat amount={investment.annualizedIrr} />
      </ClickableTableCell>
      <ClickableTableCell investment={investment}>
        <MoneyFormat amount={investment.currentValue} />
      </ClickableTableCell>
    </TableRow>
  );
}