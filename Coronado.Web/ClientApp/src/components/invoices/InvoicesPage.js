import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewInvoice from './NewInvoice';

class InvoicesPage extends Component {

  render() {
    
    return (
      <div>
        <h1>
          Invoices
          <NewInvoice />
        </h1>
        {/* <CategoryList categories={this.props.categories} /> */}
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
  mapStateToProps,
)(InvoicesPage);
