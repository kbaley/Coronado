import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navListActions from '../../actions/navListActions'
import './DeleteAccount.css';
import { Button } from 'react-bootstrap';

class ToggleAllAccounts extends Component {

  displayName = ToggleAllAccounts.name;
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.actions.toggleAllAccounts();
  }

  render() {
    var text = this.props.showAllAccounts ? "Hide hidden" : "Show all"
    return (
      <span style={{paddingLeft: "120px", textAlign: "right"}}>
        <Button size="sm" variant="primary" onClick={this.toggle} active={this.props.showAllAccounts}>{text}</Button>
      </span>
    );
  }
}
function mapStateToProps(state) {
   return {
     showAllAccounts: state.showAllAccounts
   }
}

function mapDispatchToProps(dispatch) {
   return {
     actions: bindActionCreators({...navListActions}, dispatch)
   }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToggleAllAccounts);

