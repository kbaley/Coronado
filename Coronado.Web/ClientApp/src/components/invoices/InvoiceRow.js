import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';

export function InvoiceRow({invoice, onEdit, onDelete}) {
  return (
    <tr>
      <td>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
      </td>
      <td>{invoice.invoiceNumber}</td>
    </tr>
  );
}