import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem, Glyphicon } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';


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
        <Glyphicon glyph='cog' /> Categories
      </NavItem>
    </LinkContainer>);
  }
}

export default withRouter(CategoriesMenu);