import React, { Component } from 'react';
import { Button, Modal, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';

export class AccountForm extends Component {
  constructor(props) {
    super(props);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      newAccount: true,
      account: { name: '', vendor: '', startingBalance: 0, currency: 'USD', startDate: new Date().toLocaleDateString() }
    };
    if (this.props.account) {
        this.state = {
            newAccount: false,
            account: { 
                name: this.props.account.name,
                vendor: this.props.account.vendor || '',
                currency: this.props.account.currency || '',
                accountId: this.props.account.accountId
            }
        }
    }
  }
  handleChangeName(e) {
    var name = e.target.name;
    this.setState({ account: { ...this.state.account, [name]: e.target.value } });
  }
  onSave() {
    this.props.onSave(this.state.account);
    if (this.state.newAccount)
    {
      this.setState(...this.state, { account: { ...this.state.account, name: '', startingBalance: 0, currency: 'USD', vendor: '' } });
    }
    this.props.onClose();
  }
  render() {
    return (<Modal show={this.props.show} onHide={this.props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>New account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Account Name</Col>
            <Col sm={9}>
              <FormControl autoFocus type="text" ref="inputName" name="name" value={this.state.account.name} onChange={this.handleChangeName} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Vendor</Col>
            <Col sm={9}>
              <FormControl type="text" name="vendor" value={this.state.account.vendor} onChange={this.handleChangeName} />
            </Col>
          </FormGroup>
          {this.state.newAccount &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Starting Balance</Col>
            <Col sm={3}>
              <FormControl type="number" name="startingBalance" value={this.state.account.startingBalance} onChange={this.handleChangeName} />
            </Col>
          </FormGroup>
          }
          {this.state.newAccount &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Starting Date</Col>
            <Col sm={5}>
              <FormControl type="text" name="startDate" value={this.state.account.startDate} onChange={this.handleChangeName} placeholder="mm/dd/yyyy" />
            </Col>
          </FormGroup>
          }
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Currency</Col>
            <Col sm={3}>
              <FormControl type="text" name="currency" value={this.state.account.currency} onChange={this.handleChangeName} />
            </Col>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.onSave}>Save</Button>
      </Modal.Footer>
    </Modal>);
  }
}