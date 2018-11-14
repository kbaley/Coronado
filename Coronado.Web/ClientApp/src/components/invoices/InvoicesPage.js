import React, { Component } from 'react';
import NewInvoice from './NewInvoice';

export class InvoicesPage extends Component {
  render() {
    return (
      <div>
        <h1>
          Invoices <NewInvoice />
        </h1>
      </div>
    );
  }
}

export default InvoicesPage;