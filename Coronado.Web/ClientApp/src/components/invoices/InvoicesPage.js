import React, { Component } from 'react';
import NewInvoice from './NewInvoice';
import { connect } from 'react-redux';
import InvoiceList from "./InvoiceList";

export class InvoicesPage extends Component {
  render() {
    return (
      <div>
        <h1>
          Invoices <NewInvoice />
        </h1>
        <InvoiceList invoices={this.props.invoices} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    invoices: state.invoices,
  }
}

export default connect(
  mapStateToProps
)(InvoicesPage);