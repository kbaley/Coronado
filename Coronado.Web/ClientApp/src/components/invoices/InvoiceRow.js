import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { NullableDate } from '../common/NullableDate';
import { Icon } from '../icons/Icon';
import { CustomTableRow } from '../common/Table';

export function InvoiceRow({invoice, onEdit, onDelete, onDownload, onEmail, onPreview}) {
  return (
    <CustomTableRow
      key={invoice.invoiceId}
      tableData={[
        invoice.invoiceNumber,
        new Date(invoice.date).toLocaleDateString(), 
        invoice.customerName + " (" + invoice.customerEmail + ")",
        NullableDate({date: invoice.lastSentToCustomer}),
        CurrencyFormat({value: invoice.balance}) 
      ]}>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
        <Icon onClick={onDownload} glyph="file-download" title="Download" />
        <Icon onClick={onEmail} glyph="envelope" title="Email" />
        <Icon onClick={onPreview} glyph="external-link-alt" title="Preview" />
      </CustomTableRow>
  );
}