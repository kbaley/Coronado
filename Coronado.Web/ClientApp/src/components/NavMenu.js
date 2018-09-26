import React from 'react';
import { Link } from 'react-router-dom';
import { NewAccount } from './NewAccount';
import { Navbar } from 'react-bootstrap';
import AccountNavList from './AccountNavList';
import './NavMenu.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Counter';

const NavMenu = props => (
  <Navbar inverse fixedTop fluid collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to={'/'}>Accounts</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
    </Navbar.Collapse>
  </Navbar>
);

export default connect(
  state => state.accounts,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(NavMenu);