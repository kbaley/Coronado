import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { NullableDate } from '../common/NullableDate';
import { Icon } from '../icons/Icon';
import { CustomTableRow } from '../common/Table';
import GetAppIcon from '@material-ui/icons/GetApp';
import EmailIcon from '@material-ui/icons/Email';
import LaunchIcon from '@material-ui/icons/Launch';

export function InvoiceRow({invoice, onEdit, onDelete, onDownload, onEmail, onPreview}) {
  return (
    <CustomTableRow
      tableData={[
        invoice.invoiceNumber,
        new Date(invoice.date).toLocaleDateString(), 
        invoice.customerName + " (" + invoice.customerEmail + ")",
        NullableDate({date: invoice.lastSentToCustomer}),
        CurrencyFormat({value: invoice.balance}) 
      ]}>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
        <Icon 
          onClick={onDownload} 
          title="Download" 
          icon={<GetAppIcon />}
        />
        <Icon 
          onClick={onEmail} 
          title="Email" 
          icon={<EmailIcon />}
        />
        <Icon 
          onClick={onPreview} 
          title="Preview" 
          icon={<LaunchIcon />}
        />
      </CustomTableRow>
  );
}