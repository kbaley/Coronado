import React from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell, makeStyles } from '@material-ui/core';
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export function CustomTableRow(props) {
  const classes = useStyles();
  const { tableData, key } = props;
  return (
    <TableRow className={classes.tableBodyRow}>
      <TableCell className={classes.tableCell}>
        {props.children}
      </TableCell>
      {tableData.map(prop => {
        return (
          <TableCell
            key={key}
            classname={classes.tableCell}
          >
            {prop}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export default function CustomTable(props) {

  const classes = useStyles();
  const { tableHeader } = props;

  return (
    <Table className={classes.table}>
      <TableHead className={classes.primaryTableHeader}>
        <TableRow className={classes.tableHeadRow}>
          {tableHeader.map((prop, key) => {
            return (
              <TableCell
                key={key}
                className={classes.tableCell + " " + classes.tableHeadCell}
              >
                {prop}
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.children}
      </TableBody>
    </Table>
  );
}