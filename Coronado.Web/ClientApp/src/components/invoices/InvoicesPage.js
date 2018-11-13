import React, { Component } from 'react';
import { connect } from 'react-redux';

export class InvoicesPage extends Component {
  render() {
    return (
      <div>
        <h1>
          Invoices
        </h1>
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
