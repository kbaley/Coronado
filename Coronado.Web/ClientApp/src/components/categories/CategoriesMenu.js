import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class CategoriesMenu extends Component {
  constructor(props) {
    super(props);
    this.goToCategories = this.goToCategories.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
      Mousetrap.bind('g c', this.goToCategories);
  }

  goToCategories() {
    this.props.history.push('/categories');
  }

  render() {
    return (<LinkContainer to={'/categories'}>
      <NavItem>
        <FontAwesomeIcon icon="cog" /><span style={{marginLeft: "15px"}}>Categories</span>
      </NavItem>
    </LinkContainer>);
  }
}

export default withRouter(CategoriesMenu);