import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CustomTableRow } from '../common/Table';

export function CustomerRow({customer, onEdit, onDelete}) {
  return (
    <CustomTableRow
      key={customer.customerId}
      tableData={[
        customer.name,
        customer.email,
        customer.streetAddress,
        customer.city,
        customer.region
      ]}>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
      </CustomTableRow>
  );
}