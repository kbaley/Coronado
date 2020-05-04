import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { Icon } from '../icons/Icon';
import { MoneyFormat } from '../common/DecimalFormat';
import { CustomTableRow } from '../common/Table';

export function InvestmentRow({investment, onEdit, onDelete, openPriceHistory}) {
  
  return (
    <CustomTableRow
      tableData={[
        investment.name,
        investment.symbol,
        investment.currency,
        investment.shares,
        <MoneyFormat amount={investment.lastPrice} />,
        <MoneyFormat amount={investment.currentValue} />
      ]}
    >
      <EditIcon onStartEditing={onEdit} />
      <DeleteIcon onDelete={onDelete} />
      <Icon onClick={openPriceHistory} glyph="dollar-sign" title="Show historical prices" />
    </CustomTableRow>
  );
}