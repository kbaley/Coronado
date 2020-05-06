import React from 'react';
import { CurrencyFormat } from "../common/CurrencyFormat";
import { TableRow, TableCell, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  footer: {
    fontSize: "18px",
    fontWeight: 500,
    backgroundColor: "#eee"
  }
});

export default function DisplayTotalRow(props) {
  const { text, value } = props;
  const classes = useStyles();
  return (
      <TableRow className={classes.tableFooterRow}>
        <TableCell 
          colSpan={6} 
          align="right" 
          className={classes.tableCell + " " + classes.footer}
        >
          {text}
        </TableCell>
        <TableCell className={classes.tableCell + " " + classes.footer}><CurrencyFormat value={value} /></TableCell>
      </TableRow>
  );
};
