import React from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell, makeStyles } from '@material-ui/core';
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(styles);

export function CustomTableRow(props) {
  const classes = useStyles();
  const { tableData, key, skipFirstCell } = props;
  return (
    <TableRow className={classes.tableBodyRow}>
      {!skipFirstCell &&
        <TableCell className={classes.tableCell}>
          {props.children}
        </TableCell>
      }
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

CustomTableRow.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.string),
  key: PropTypes.string,
  skipFirstCell: PropTypes.bool,
}

export default function CustomTable(props) {

  const classes = useStyles();
  const { tableHeader, className, headerAlignment } = props;

  return (
    <Table className={classes.table + " " + className}>
      <TableHead className={classes.primaryTableHeader}>
        <TableRow className={classes.tableHeadRow}>
          {tableHeader.map((prop, key) => {
            return (
              <TableCell
                key={key}
                align={headerAlignment ? headerAlignment[key] : 'inherit' }
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

CustomTable.propTypes = {
  tableHeader: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  headerAlignment: PropTypes.arrayOf(PropTypes.string),
}