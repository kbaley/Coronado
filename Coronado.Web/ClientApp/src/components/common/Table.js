import React from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import { PropTypes } from 'prop-types';

export function CustomTableRow(props) {
  const { tableData, skipFirstCell } = props;
  return (
    <TableRow>
      {!skipFirstCell &&
        <TableCell>
          {props.children}
        </TableCell>
      }
      {tableData.map((prop, key) => {
        return (
          <TableCell
            key={key}
          >
            {prop}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

CustomTableRow.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.any),
  skipFirstCell: PropTypes.bool,
}

export default function CustomTable(props) {

  const { tableHeader, className, headerAlignment } = props;

  return (
    <Table className={className}>
      <TableHead>
        <TableRow>
          {tableHeader.map((prop, key) => {
            return (
              <TableCell
                key={key}
                align={headerAlignment ? headerAlignment[key] : 'inherit' }
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