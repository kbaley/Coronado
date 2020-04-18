import React, { Component } from 'react';
import { Button, Modal, Form, FormControl, FormGroup, ControlLabel, Col, Checkbox } from 'react-bootstrap';
import TextField from "../common/TextField";

class InvestmentForm extends Component {
  displayName = InvestmentForm.name;
  constructor(props) {
    super(props);
    this.saveInvestment = this.saveInvestment.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newInvestment: true,
      investment: { name: '', symbol: '', shares: 0, price: 0, currency: 'USD', dontRetrievePrices: false }
    };
  }

  componentDidUpdate() {
    if (this.props.investment && this.props.investment.investmentId
      && this.props.investment.investmentId !== this.state.investment.investmentId) {
      this.setState({
        newInvestment: false,
        investment: {
          investmentId: this.props.investment.investmentId,
          name: this.props.investment.name,
          symbol: this.props.investment.symbol || '',
          shares: this.props.investment.shares || 0,
          price: this.props.investment.price || 0.00,
          currency: this.props.investment.currency || 'USD',
          dontRetrievePrices: this.props.investment.dontRetrievePrices
        }
      });
    }
  }

  saveInvestment() {
    this.props.onSave(this.state.investment);
    this.setState({ investment: { name: '', symbol: '', shares: 0, price: 0, dontRetrievePrices: false } });
    this.props.onClose();
  }

  handleChangeField(e) {
    var name = e.target.name;
    var value = e.target.value;
    if (e.target.type === "checkbox")
      value = e.target.checked;
    this.setState({ investment: { ...this.state.investment, [name]: value } });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Investment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Name</Col>
              <Col sm={9}>
                <FormControl
                  type="text" autoFocus
                  name="name" ref="inputName"
                  value={this.state.investment.name}
                  onChange={this.handleChangeField}
                />
              </Col>
            </FormGroup>
            <TextField width={4}
              label="Symbol"
              name="symbol"
              value={this.state.investment.symbol}
              onChange={this.handleChangeField}
            />
            <TextField width={4}
              label="Starting Shares"
              name="shares"
              value={this.state.investment.shares}
              onChange={this.handleChangeField}
            />
            <TextField width={4}
              label="Starting Price"
              name="price"
              value={this.state.investment.price}
              onChange={this.handleChangeField}
            />
            <TextField width={4}
              label="Currency"
              name="currency"
              value={this.state.investment.currency}
              onChange={this.handleChangeField}
            />
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Don't retrieve prices?</Col>
              <Col sm={3}>
                <Checkbox 
                  name="dontRetrievePrices" 
                  checked={this.state.investment.dontRetrievePrices}
                  onChange={this.handleChangeField} />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.saveInvestment}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default InvestmentForm;
