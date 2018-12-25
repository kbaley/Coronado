import React, { Component } from 'react';
import { Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';
import TextField from "../common/TextField";

class InvestmentForm extends Component {
  displayName = InvestmentForm.name;
  constructor(props) {
    super(props);
    this.saveInvestment = this.saveInvestment.bind(this);   
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newInvestment: true,
      investment: {name: '', symbol: '', shares: 0, price: 0, url: ''}
    };
  }

  componentDidUpdate() {
    if (this.props.investment && this.props.investment.investmentId 
        && this.props.investment.investmentId !== this.state.investment.investmentId ) {
      this.setState({
        newInvestment: false,
        investment: {
          investmentId: this.props.investment.investmentId, 
          name: this.props.investment.name,
          symbol: this.props.investment.symbol || '',
          shares: this.props.investment.shares || 0,
          price: this.props.investment.price || 0.00,
          url: this.props.investment.url || ''
        }
      });
    }
  }

  saveInvestment() {
    this.props.onSave(this.state.investment);
    this.setState({investment: {name: '', symbol: '', shares: 0, price: 0, url: ''} });
    this.props.onClose();
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { investment: {...this.state.investment, [name]: e.target.value } } );
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
            <TextField width={6}
              label="Starting Shares"
              name="shares"
              value={this.state.investment.shares}
              onChange={this.handleChangeField}
            />
            <TextField
              label="Starting Price"
              name="price"
              value={this.state.investment.price}
              onChange={this.handleChangeField}
            />
            <TextField width={4}
              label="Url"
              name="url"
              value={this.state.investment.url}
              onChange={this.handleChangeField}
            />
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
