import React, { Component } from 'react';
import { Modal, Table } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import './ShortcutHelper.css'

export class ShortcutHelper extends Component {
  constructor(props) {
    super(props);
    this.showHelp = this.showHelp.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = { show: false };
  }
  componentDidMount() {
    Mousetrap.bind('?', this.showHelp);
  }
  showHelp() {
    this.setState({ show: true });
  }
  handleClose() {
    this.setState({ show: false });
  }
  render() {
    return (<Modal show={this.state.show} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Shortcuts</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table condensed className='borderless'>
          <tbody>
            <tr>
              <td>g [1-9]</td>
              <td>Go to account</td>
            </tr>
            <tr>
              <td>n a</td>
              <td>New account</td>
            </tr>
            <tr>
              <td>n t</td>
              <td>New transaction</td>
            </tr>
            <tr>
              <td>g c</td>
              <td>Go to categories</td>
            </tr>
            <tr>
              <td>n c</td>
              <td>New category</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>);
  }
}