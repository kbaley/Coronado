import React, { Component } from 'react';
import { Button,Modal, Table} from 'react-bootstrap';
import Moment from 'react-moment';
import { orderBy } from 'lodash';
import {Icon} from "../icons/Icon";

class TodaysPrices extends Component {
  displayName = TodaysPrices.name;
  constructor(props) {
    super(props);
    this.savePrices = this.savePrices.bind(this);   
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.showTodaysPrices = this.showTodaysPrices.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getLastPrice = this.getLastPrice.bind(this);
    this.state = {
      investments: [],
      show: false
    };
  }

  componentDidUpdate() {
    if (this.props.investments && this.props.investments.length > 0 
        && this.props.investments.length !== this.state.investments.length ) 
      {
        this.setState({
          investments: this.props.investments.map( i => {
            var lastPrice = this.getLastPrice(i);
            return {
              investmentId: i.investmentId,
              name: i.name,
              lastPriceDate: lastPrice.date,
              lastPrice: lastPrice.price
            }  
          })
        })
      };
    
    }

  showTodaysPrices() {
    this.setState({show:true});
    return false;
  }

  getLastPrice(investment) {
    if (!investment.historicalPrices || !investment.historicalPrices.length === 0) {
      return {
        date: new Date(),
        price: 0.00
      };
    }

    var lastPrice = orderBy(investment.historicalPrices, ['date'], ['desc'] )[0];
    return (({date, price}) => ({date, price}))(lastPrice);
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.savePrices();
    }
  }

  savePrices() {
    this.props.onSave(this.state.investments);
    this.setState({
      investments: [ ],
      show: false
    });
  }
  
  handleChangePrice(investmentIndex, e) {
    let investments = [...this.state.investments];
    investments[investmentIndex].lastPrice = e.target.value;
    
    this.setState({
      investments
    });
  }

  handleClose() {
    this.setState({show:false});
  }

  render() {
    
    return (
      <span>

        <Icon glyph="dollar-sign" onClick={this.showTodaysPrices} title="Update todays prices" />
        <Modal show={this.state.show} onHide={this.handleClose} autoFocus={false}>
          <Modal.Header closeButton>
            <Modal.Title>Today's Prices</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Investment</th>
                  <th>Last Price Date</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
              {this.state.investments && this.state.investments.map( (i, index) => {
                return (
                <tr key={i.investmentId}>
                  <td>{i.name}</td>
                  <td><Moment format="M/D/YYYY">{i.lastPriceDate}</Moment></td>
                  <td>
                    <input type="text" name="price" value={i.lastPrice}
                      onChange={(e) => this.handleChangePrice(index, e)} />
                  </td>
                </tr>
                );
              })}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.savePrices}>Save</Button>
          </Modal.Footer>
        </Modal>
      </span>
    );
  };
}

export default TodaysPrices;
