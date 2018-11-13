import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { NewIcon } from '../icons/NewIcon';
import './NewInvoice.css';
import InvoiceForm from './InvoiceForm';

export class NewInvoice extends Component {
  constructor(props) {
    super(props);
    this.showForm = this.showForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = { show: false, 
        invoice: {name: '', type: ''}
    };
  }

  componentDidMount() {
      Mousetrap.bind('n i', this.showForm);
  }

  componentWillUnmount() {
      Mousetrap.unbind('n i');
  }

  showForm() {
    this.setState({show:true});
    return false;
  }

  handleClose() {
    this.setState({show:false});
  }
  render() {
    return (<span>
        <NewIcon onClick={this.showForm} className="new-invoice"/>
        <InvoiceForm show={this.state.show} onClose={this.handleClose} onSave={this.saveCategory} />
      </span>);
  };
}

function mapStateToProps(state) {
  return {
    invoices: state.invoices
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewInvoice);