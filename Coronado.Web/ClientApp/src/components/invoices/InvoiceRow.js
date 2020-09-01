import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { Icon } from '../icons/Icon';
import GetAppIcon from '@material-ui/icons/GetApp';
import EmailIcon from '@material-ui/icons/Email';
import LaunchIcon from '@material-ui/icons/Launch';
import { TableRow, TableCell } from '@material-ui/core';

export function InvoiceRow({invoice, onEdit, onDelete, onDownload, onEmail, onPreview}) {
  return (
    <TableRow>
      <TableCell>
        <EditIcon onStartEditing={onEdit} fontSize="small" />
        <DeleteIcon onDelete={onDelete} fontSize="small" />
        <Icon 
          onClick={onDownload} 
          title="Download" 
          icon={<GetAppIcon fontSize="small" />}
        />
        <Icon 
          onClick={onEmail} 
          title="Email" 
          icon={<EmailIcon fontSize="small"/>}
        />
        <Icon 
          onClick={onPreview} 
          title="Preview" 
          icon={<LaunchIcon fontSize="small"/>}
        />
      </TableCell>
      <TableCell>{invoice.invoiceNumber}</TableCell>
      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
      <TableCell>{invoice.customerName + " (" + invoice.customerEmail + ")" }</TableCell>
      <TableCell>
        {invoice.lastSentToCustomer &&
        new Date(invoice.lastSentToCustomer).toLocaleDateString()
        }
      </TableCell>
      <TableCell><CurrencyFormat value={invoice.balance} /></TableCell>
    </TableRow>
  );
}