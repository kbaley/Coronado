import React, { Component } from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { MoneyFormat } from '../common/DecimalFormat';
import Moment from 'react-moment';
import { parseMmDdDate } from '../common/dateHelpers';
import { getEmptyGuid } from '../common/guidHelpers';
import { orderBy } from 'lodash';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import CustomTable, { CustomTableRow } from '../common/Table';

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
      newInvestment: { date: '', price: 0 },
      investment: {},
      prices: []
    };
  }

  componentDidUpdate() {
    if (this.props.investment && this.props.investment.investmentId
      && this.props.investment.investmentId !== this.state.investment.investmentId) {
      this.setState({
        investment: {
          investmentId: this.props.investment.investmentId,
          name: this.props.investment.name,
          symbol: this.props.investment.symbol || '',
        },
        prices: orderBy(this.props.investment.historicalPrices, ['date'], ['desc']).map(p => ({
          ...p,
          status: "Unchanged"
        }))
      });
    }
  }

  deletePrice(price) {
    var priceIndex = this.state.prices.indexOf(price);
    if (priceIndex > -1) {
      var prices = [...this.state.prices];
      prices[priceIndex].status = "Deleted";
      this.setState({ prices });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.savePrice();
    }
  }

  savePrices() {
    this.savePrice();
    this.props.onSave(this.state.investment, this.state.prices);
    this.setState({
      newInvestment: { date: '', price: 0 },
      investment: {},
      prices: []
    });
    this.props.onClose();
  }

  setFocus(e) {
    if (e) e.preventDefault();
    this.refs["inputDate"].focus();
    return false;
  }

  savePrice() {
    if (this.state.newInvestment.date === '' || this.state.newInvestment.price === '') return;
    var newPrice = {
      date: parseMmDdDate(this.state.newInvestment.date).format(),
      price: this.state.newInvestment.price,
      investmentId: this.state.investment.investmentId,
      status: 'Added',
      investmentPriceId: getEmptyGuid()
    }
    this.state.prices.push(newPrice);
    this.setState({ newInvestment: { date: '', price: this.state.newInvestment.price } });
    this.setFocus();
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState({ newInvestment: { ...this.state.newInvestment, [name]: e.target.value } });
  }

  render() {
    return (
      <Dialog
        onClose={this.props.onClose}
        open={this.props.show}
      >
        <DialogTitle>{this.state.investment.name}</DialogTitle>
        <DialogContent>
          <CustomTable
            tableHeader={['', 'Date', 'Price']}
            headerAlignment={['', '', 'right']}
          >
            {this.state.prices && this.state.prices.map((p, index) =>
              p.status !== "Deleted" &&
              <CustomTableRow
                key={index}
                tableData={[
                  <Moment format="M/D/YYYY">{p.date}</Moment>,
                  <MoneyFormat amount={p.price} />
                ]}>
                <DeleteIcon onDelete={() => this.deletePrice(p)} />
              </CustomTableRow>
            )}
            <CustomTableRow
              tableData={[
                <input
                  type="text"
                  name="date"
                  ref="inputDate"
                  autoFocus={true}
                  value={this.state.newInvestment.date} onChange={this.handleChangeField} />,
                <input type="text"
                  name="price"
                  style={{ "textAlign": "right" }}
                  onKeyPress={this.handleKeyPress}
                  value={this.state.newInvestment.price} onChange={this.handleChangeField} />
              ]}
            >
              <CheckIcon onClick={this.savePrice} />
            </CustomTableRow>
          </CustomTable>
          <table striped bordered>
            <tbody>
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.savePrices} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default InvestmentPriceHistory;
