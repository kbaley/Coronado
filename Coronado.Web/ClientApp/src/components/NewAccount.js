﻿import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Nav, NavItem } from 'react-bootstrap';
import { Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';
import { actionCreators } from '../store/AccountNavList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';

class NewAccount extends Component {
  displayName = NewAccount.name

  constructor(props) {
    super(props);
    this.newAccount = this.newAccount.bind(this);
    this.saveNewAccount = this.saveNewAccount.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.state = { show: false, 
      account: {name: '', startingBalance: 10, currency: 'USD', startDate: new Date().toLocaleDateString()}
     };
  }

  componentDidMount() {
    Mousetrap.bind('n a', this.newAccount);
  }

  componentWillUnmount() {
    Mousetrap.unbind('n a');
  }

  newAccount() {
    this.setState({show:true});
    let node = ReactDOM.findDOMNode(this.refs.inputName);
    if (node && node.focus instanceof Function)
      node.focus();
    return false;
  }

  saveNewAccount() {
    this.props.saveNewAccount(this.state.account);
    this.setState(...this.state, {account: {...this.state.account, name: '', startingBalance: 0, currency: 'USD'}});
    this.handleClose();
  }

  handleClose() {
    this.setState({show:false});
  }

  handleChangeName(e) {
    var name = e.target.name;
    this.setState( { account: {...this.state.account, [name]: e.target.value } } );

  }

  render() {
    return (
      <Nav>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>New account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Account Name</Col>
                <Col sm={9}>
              <FormControl
                type="text" ref="inputName" name="name"
                value={this.state.account.name}
                onChange={this.handleChangeName}
              />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Starting Balance</Col>
                <Col sm={3}>
                  <FormControl type="number" name="startingBalance" value={this.state.account.startingBalance}
                    onChange={this.handleChangeName} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Starting Date</Col>
                <Col sm={5}>
                  <FormControl type="text" name="startDate" value={this.state.account.startDate}
                    onChange={this.handleChangeName} placeholder="mm/dd/yyyy" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Currency</Col>
                <Col sm={3}>
                  <FormControl type="text" name="currency" value={this.state.account.currency}
                    onChange={this.handleChangeName} />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.saveNewAccount}>Save</Button>
          </Modal.Footer>
        </Modal>
        <NavItem>
        <Button onClick={this.newAccount}>New Account</Button>
        </NavItem>
      </Nav>
    );
  }
}

export default connect(
  state => state.accountNavList,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(NewAccount);