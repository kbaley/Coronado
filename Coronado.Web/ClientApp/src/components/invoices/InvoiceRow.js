import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { Icon } from '../icons/Icon';
import GetAppIcon from '@material-ui/icons/GetApp';
import EmailIcon from '@material-ui/icons/Email';
import LaunchIcon from '@material-ui/icons/Launch';
import { Grid } from '@material-ui/core';
import GridRow from '../common/grid/GridRow';
import * as widths from './InvoiceWidths';
import GridItem from '../common/grid/GridItem';

export function InvoiceRow({invoice, onEdit, onDelete, onDownload, onEmail, onPreview}) {
  return (
    <GridRow xs={12}>
      <Grid item xs={widths.ICON_WIDTH}>
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
      </Grid>
      <GridItem xs={widths.NUMBER_WIDTH}>{invoice.invoiceNumber}</GridItem>
      <GridItem xs={widths.DATE_WIDTH}>{new Date(invoice.date).toLocaleDateString()}</GridItem>
      <GridItem xs={widths.CUSTOMER_WIDTH}>{invoice.customerName + " (" + invoice.customerEmail + ")" }</GridItem>
      <GridItem xs={widths.DATE_SENT_WIDTH}>
        {invoice.lastSentToCustomer &&
        new Date(invoice.lastSentToCustomer).toLocaleDateString()
        }
      </GridItem>
      <GridItem xs={widths.BALANCE_WIDTH}><CurrencyFormat value={invoice.balance} /></GridItem>
    </GridRow>
  );
}