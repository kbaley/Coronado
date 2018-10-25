import React, { Component } from 'react';
import { Button, Modal, Form, FormControl, FormGroup, ControlLabel, Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

export class AccountForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeMortgageType = this.handleChangeMortgageType.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      newAccount: true,
      account: { 
        name: '', 
        vendor: '', 
        startingBalance: 0, 
        currency: 'USD', 
        mortgageType: 'fixedPayment',
        mortgagePayment: '',
        startDate: new Date().toLocaleDateString() }
    };
    if (this.props.account) {
        this.state = {
            newAccount: false,
            account: { 
                name: this.props.account.name,
                vendor: this.props.account.vendor || '',
                currency: this.props.account.currency || '',
                accountType: this.props.account.accountType || '',
                accountId: this.props.account.accountId,
                mortgageType: this.props.account.mortgageType || '',
                mortgagePayment: this.props.account.mortgagePayment || ''
            }
        }
    }
  }

  handleChange(e) {
    var name = e.target.name;
    this.setState({ account: { ...this.state.account, [name]: e.target.value } });
  }
  handleChangeType(e) {
    this.setState({ account: { ...this.state.account, accountType: e.target.value } });
  }
  handleChangeMortgageType(e) {
    this.setState({ account: { ...this.state.account, mortgageType: e } } );
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
              <FormControl autoFocus type="text" ref="inputName" name="name" value={this.state.account.name} onChange={this.handleChange} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Vendor</Col>
            <Col sm={9}>
              <FormControl type="text" name="vendor" value={this.state.account.vendor} onChange={this.handleChange} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Account Type</Col>
            <Col sm={9}>
              <FormControl componentClass="select" name="accountType" 
                  onChange={this.handleChangeType} value={this.state.account.accountType}>
                <option>Select...</option>
                {this.props.accountTypes ? this.props.accountTypes.map(t => 
                <option key={t} value={t}>{t}</option>
                ) : <option>Select...</option>}
              </FormControl>
            </Col>
          </FormGroup>
          {this.state.newAccount &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Starting Balance</Col>
            <Col sm={3}>
              <FormControl type="number" name="startingBalance" value={this.state.account.startingBalance} onChange={this.handleChange} />
            </Col>
          </FormGroup>
          }
          {this.state.newAccount &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Starting Date</Col>
            <Col sm={5}>
              <FormControl type="text" name="startDate" value={this.state.account.startDate} onChange={this.handleChange} placeholder="mm/dd/yyyy" />
            </Col>
          </FormGroup>
          }
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Currency</Col>
            <Col sm={3}>
              <FormControl type="text" name="currency" value={this.state.account.currency} onChange={this.handleChange} />
            </Col>
          </FormGroup>
          {this.state.account.accountType === "Mortgage" &&
          <React.Fragment>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Monthly Payment</Col>
              <Col sm={3}>
                <FormControl type="text" name="mortgagePayment" value={this.state.account.mortgagePayment} onChange={this.handleChange} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Mortgage Type</Col>
              <Col sm={9}>
                <ToggleButtonGroup type="radio" value={this.state.account.mortgageType} onChange={this.handleChangeMortgageType} name="mortgageType">
                  <ToggleButton value={'fixedPayment'}>Fixed Payment</ToggleButton>
                  <ToggleButton value={'fixedPrincipal'}>Fixed Principal</ToggleButton>
                </ToggleButtonGroup>
              </Col>
            </FormGroup>
          </React.Fragment>  
          }
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.onSave}>Save</Button>
      </Modal.Footer>
    </Modal>);
  }
}