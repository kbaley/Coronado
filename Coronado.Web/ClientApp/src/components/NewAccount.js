import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';
import { actionCreators } from '../store/AccountNavList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class NewAccount extends Component {
  displayName = NewAccount.name

  constructor(props) {
    super(props);
    this.newAccount = this.newAccount.bind(this);
    this.saveNewAccount = this.saveNewAccount.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeBalance = this.handleChangeBalance.bind(this);
    this.state = { show: false, 
      account: {name: '', startingBalance: 0}
     };
  }

  newAccount() {
    this.setState({show:true});
  }

  saveNewAccount() {
    this.props.saveNewAccount(this.state.account);
    this.setState(...this.state, {account: {name: '', startingBalance: 0}});
    this.handleClose();
  }

  handleClose() {
    this.setState({show:false});
  }

  handleChangeName(e) {
    this.setState( { account: {...this.state.account, name: e.target.value } } );
  }

  handleChangeBalance(e) {
    this.setState( { account: {...this.state.account, startingBalance: e.target.value } } );
  }

  render() {
    return (
      <Nav>
        <NavItem>
        <Button onClick={this.newAccount}>New Account</Button>
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
                type="text"
                value={this.state.account.name}
                onChange={this.handleChangeName}
              />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Starting Balance</Col>
                <Col sm={3}>
                  <FormControl type="number" value={this.state.account.startingBalance}
                    onChange={this.handleChangeBalance}
                  />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.saveNewAccount}>Save</Button>
          </Modal.Footer>
        </Modal>
        </NavItem>
      </Nav>
    );
  }
}

export default connect(
  state => state.accountNavList,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(NewAccount);