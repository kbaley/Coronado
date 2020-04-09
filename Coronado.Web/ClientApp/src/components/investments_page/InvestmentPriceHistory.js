import React, { Component } from 'react';
import { Button,Modal} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table';

class InvestmentPriceHistory extends Component {
  displayName = InvestmentPriceHistory.name;
  columns = [{
    dataField: 'investmentPriceId',
    text: 'ID'
  },
  {
    dataField: 'date',
    text: 'Date'
  }];
  constructor(props) {
    super(props);
    this.saveInvestment = this.saveInvestment.bind(this);   
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newInvestment: true,
      investment: {name: '', symbol: '', shares: 0, price: 0, url: '', currency: 'USD'}
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
          currency: this.props.investment.currency || 'USD',
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
    console.log(this.state.investment);
    
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.investment.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{this.state.investment.historicalPrices}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.saveInvestment}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default InvestmentPriceHistory;
