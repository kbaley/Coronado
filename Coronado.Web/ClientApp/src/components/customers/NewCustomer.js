import React, { Component } from 'react';
import * as actions from '../../actions/customerActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { NewIcon } from '../icons/NewIcon';
import './NewCustomer.css';
import CustomerForm from './CustomerForm';

export class NewCustomer extends Component {
  constructor(props) {
    super(props);
    this.showForm = this.showForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = { show: false, 
        customer: {name: ''}
    };
  }

  componentDidMount() {
      Mousetrap.bind('n u', this.showForm);
  }

  componentWillUnmount() {
      Mousetrap.unbind('n u');
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
        <NewIcon onClick={this.showForm} className="new-customer"/>
        <CustomerForm show={this.state.show} onClose={this.handleClose} onSave={this.props.actions.saveCustomer} />
      </span>);
  };
}

function mapStateToProps(state) {
  return {
    customers: state.customers
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
)(NewCustomer);