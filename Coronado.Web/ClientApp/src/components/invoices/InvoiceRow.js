import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { Icon } from '../icons/Icon';

export function InvoiceRow({invoice, onEdit, onDelete, onDownload}) {
  return (
    <tr>
      <td>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
        <Icon onClick={onDownload} glyph="download-alt" />
      </td>
      <td>{invoice.invoiceNumber}</td>
      <td>{new Date(invoice.date).toLocaleDateString()}</td>
      <td>{invoice.customerName}</td>
      <td><CurrencyFormat value={invoice.balance} /></td>
    </tr>
  );
}