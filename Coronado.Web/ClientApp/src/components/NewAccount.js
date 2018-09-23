import React, { Component } from 'react';
import { Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';

export class NewAccount extends Component {
  displayName = NewAccount.name

  constructor(props) {
    super(props);
    this.newAccount = this.newAccount.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeBalance = this.handleChangeBalance.bind(this);
    this.saveAccount = this.saveAccount.bind(this);
    this.state = { show: false, accountName: '', startingBalance: 0 };
  }

  newAccount() {
    fetch('api/Accounts/newId')
      .then(response => response.json())
      .then(data => {
        this.setState({ accountId: data });
      });
    this.setState({show:true});
  }

  handleClose() {
    this.setState({show:false});
  }

  handleChangeName(e) {
    this.setState({ accountName: e.target.value });
  }

  handleChangeBalance(e) {
    this.setState({ startingBalance: e.target.value });
  }

  saveAccount() {
    fetch('/api/Accounts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accountId: this.state.accountId,
        name: this.state.accountName,
        startingBalance: this.state.startingBalance
      })
    })

      .then(response => response.json())
      .then(data => {
        console.log(this.props);
        this.props.onAccountAdded(data);
        this.setState({show:false});
      })
  }

  render() {
    return (
      <div>
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
                    value={this.state.accountName}
                    onChange={this.handleChangeName}
                    placeholder="Enter name"
                  />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Starting Balance</Col>
                    <Col sm={3}>
                      <FormControl type="number" value={this.state.startingBalance}
                        onChange={this.handleChangeBalance}
                      />
                    </Col>
                  </FormGroup>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.saveAccount}>Save</Button>
              </Modal.Footer>
            </Modal>
      </div>
    );
  }
}
