import React, { Component } from 'react';
import { Button,Modal, Table} from 'react-bootstrap';
import { DeleteIcon } from '../icons/DeleteIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { MoneyFormat } from '../common/DecimalFormat';
import Moment from 'react-moment';
import moment from 'moment';
import {parseMmDdDate} from '../common/dateHelpers';

class InvestmentPriceHistory extends Component {
  displayName = InvestmentPriceHistory.name;
  constructor(props) {
    super(props);
    this.savePrices = this.savePrices.bind(this);   
    this.savePrice = this.savePrice.bind(this);
    this.deletePrice = this.deletePrice.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      newInvestment: {date: '', price: 0},
      investment: { },
      prices: [ ],
      nextId: 0
    };
  }

  componentDidUpdate() {
    if (this.props.investment && this.props.investment.investmentId 
        && this.props.investment.investmentId !== this.state.investment.investmentId ) {
      this.setState({
        investment: {
          investmentId: this.props.investment.investmentId, 
          name: this.props.investment.name,
          symbol: this.props.investment.symbol || '',
        },
        prices: this.props.investment.historicalPrices.map( p => ({
          ...p,
          status: "Unchanged"
        })),
        nextId: this.props.investment.historicalPrices.length
      });
    }
  }

  deletePrice(price) {
    var priceIndex = this.state.prices.indexOf(price);
    if (priceIndex > -1) {
      var prices = [...this.state.prices];
      prices[priceIndex].status = "Deleted";
      this.setState({prices});
    } 
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.savePrice();
    }
  }

  savePrices() {
    this.props.onSave(this.state.investment);
    this.setState({investment: {name: '', symbol: '', shares: 0, price: 0, url: ''} });
    this.props.onClose();
  }
  
  setFocus(e) {
    if (e) e.preventDefault();
    this.refs["inputDate"].focus();
    return false;
  }

  savePrice() {
    var newPrice = {
      date: parseMmDdDate(this.state.newInvestment.date), 
      price: this.state.newInvestment.price
    }
    this.state.prices.push(newPrice);
    this.setState({newInvestment: {date: '', price: this.state.newInvestment.price }});
    this.setFocus();
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { newInvestment: {...this.state.newInvestment, [name]: e.target.value } } );
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose} autoFocus={false}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.investment.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
            {this.state.prices && this.state.prices.map( (p, index) =>
              p.status !== "Deleted" &&
              <tr key={index}>
                <td><DeleteIcon onDelete={() => this.deletePrice(p)} /></td>
                <td><Moment format="M/D/YYYY">{p.date}</Moment></td>
                <td><MoneyFormat amount={p.price} /></td>
              </tr>
            )}
            <tr>
              <td><CheckIcon onClick={this.savePrice} /></td>
              <td><input 
                type="text" 
                name="date" 
                ref="inputDate" 
                autoFocus={true}
                value={this.state.newInvestment.date} onChange={this.handleChangeField} /></td>
              <td style={{"textAlign": "right"}}>
                <input type="text" 
                  name="price" 
                  style={{"textAlign": "right"}}
                  onKeyPress={this.handleKeyPress}
                  value={this.state.newInvestment.price} onChange={this.handleChangeField} />
                </td>
            </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.savePrices}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default InvestmentPriceHistory;
