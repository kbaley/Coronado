import React from 'react';
import { CurrencyFormat } from "../common/CurrencyFormat";
import { NewIcon } from '../icons/NewIcon';
import { DeleteIcon } from '../icons/DeleteIcon';
import { useSelector } from 'react-redux';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    width: "85%",
    '& td, & th': {
      padding: 4,
    }
  },
  input: {
  },
  description: {
    width: "100%",
  },
  quantity: {
    width: 80,
  },
  unitAmount: {
    width: 80,
  },
});

const useStyles = makeStyles(styles);

const InvoiceLineItems = ({ lineItems, onLineItemChanged, onNewItemAdded, onLineItemDeleted }) => {
  const classes = useStyles();
  const categories = useSelector(state => state.categories);

  return (
    <Table className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Unit Cost</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {lineItems && lineItems.map(li =>
          <TableRow key={li.invoiceLineItemId}>
            <TableCell>
              <TextField
                name="description"
                variant="outlined"
                margin="dense"
                fullWidth={true}
                className={classes.input + " " + classes.description}
                value={li.description}
                onChange={(e) => onLineItemChanged(li.invoiceLineItemId, e.target.name, e.target.value)} />
            </TableCell>
            <TableCell>
              <Select
                value={li.categoryId ?? ""}
                variant="outlined"
                name="categoryId"
                margin="dense"
                style={{ minWidth: 150 }}
                onChange={(e) => onLineItemChanged(li.invoiceLineItemId, e.target.name, e.target.value)}
              >
                <MenuItem value={''}>None</MenuItem>
              {categories ? categories.map(c =>
                <MenuItem value={c.categoryId} key={c.categoryId}>{c.name}</MenuItem>
              ) : <MenuItem>Select...</MenuItem>
              }
                </Select>
            </TableCell>
          <TableCell>
            <TextField
              name="quantity"
              fullWidth={true}
              margin="dense"
              variant="outlined"
              className={classes.input + " " + classes.quantity}
              value={li.quantity}
              onChange={(e) => onLineItemChanged(li.invoiceLineItemId, e.target.name, e.target.value)} />
          </TableCell>
          <TableCell>
            <TextField
              name="unitAmount"
              value={li.unitAmount}
              fullWidth={true}
              margin="dense"
              variant="outlined"
              className={classes.input + " " + classes.unitAmount}
              onChange={(e) => onLineItemChanged(li.invoiceLineItemId, e.target.name, e.target.value)} />
          </TableCell>
          <TableCell><CurrencyFormat value={li.quantity && li.unitAmount ? (li.quantity * li.unitAmount) : 0} /></TableCell>
          <TableCell>
            <NewIcon onClick={onNewItemAdded} />
            {lineItems.length > 1 &&
              <DeleteIcon onDelete={() => onLineItemDeleted(li.invoiceLineItemId)} fontSize="sm" />
            }
          </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table >
  );
};

export default InvoiceLineItems;