import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { NullableDate } from '../common/NullableDate';
import { Icon } from '../icons/Icon';

export function InvoiceRow({invoice, onEdit, onDelete, onDownload, onEmail, onPreview}) {
  return (
    <tr>
      <td>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
        <Icon onClick={onDownload} glyph="file-download" title="Download" />
        <Icon onClick={onEmail} glyph="envelope" title="Email" />
        <Icon onClick={onPreview} glyph="external-link-alt" title="Preview" />
      </td>
      <td>{invoice.invoiceNumber}</td>
      <td>{new Date(invoice.date).toLocaleDateString()}</td>
      <td>{invoice.customerName} ({invoice.customerEmail})</td>
      <td><NullableDate date={invoice.lastSentToCustomer} /></td>
      <td><CurrencyFormat value={invoice.balance} /></td>
    </tr>
  );
}