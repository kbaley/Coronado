import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CurrencyFormat } from '../common/CurrencyFormat';

export function InvoiceRow({invoice, onEdit, onDelete}) {
  return (
    <tr>
      <td>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
      </td>
      <td>{invoice.invoiceNumber}</td>
      <td>{new Date(invoice.date).toLocaleDateString()}</td>
      <td>{invoice.customerName}</td>
      <td><CurrencyFormat value={invoice.balance} /></td>
    </tr>
  );
}