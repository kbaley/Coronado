import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import NewInvoice from './NewInvoice';
import { connect } from 'react-redux';
import InvoiceList from "./InvoiceList";
import UploadInvoiceTemplate from "./UploadInvoiceTemplate";
import {Icon} from "../icons/Icon";
import './InvoicesPage.css';

class InvoicesPage extends Component {
  constructor(props) {
    super(props);
    this.showTemplate = this.showTemplate.bind(this);
    this.uploadTemplate = this.uploadTemplate.bind(this);
    this.uploadTemplateForm = this.uploadTemplateForm.bind(this);
    this.handleChangeButton = this.handleChangeButton.bind(this);
    this.state = {
      showUploadForm: false,
      showPaid: []
    }
  }

  showTemplate() {
    window.open("/invoice/GenerateHTML");
  }

  uploadTemplateForm() {
    this.setState({showUploadForm: true});
  }

  uploadTemplate(file) {
    this.props.actions.uploadTemplate(file);
  }

  handleChangeButton(value) {
    this.setState({showPaid: value});
  }

  render() {
    return (
      <div>
        <div style={{float: "right", width: "250px", textAlign: "right"}}>
          <ToggleButtonGroup type="checkbox" value={this.state.showPaid} onChange={this.handleChangeButton}>
            <ToggleButton value={true}>Show Paid</ToggleButton>
          </ToggleButtonGroup>
          <Icon className="show-template" glyph="upload" onClick={this.uploadTemplateForm} />
          <Icon className="show-template" glyph="new-window" onClick={this.showTemplate} />
          <UploadInvoiceTemplate show={this.state.showUploadForm} onHide={() => this.setState({showUploadForm: false})}
            onUpload={this.uploadTemplate}/>
        </div>
        <h1>
          Invoices <NewInvoice />
        </h1>
        <InvoiceList showPaid={this.state.showPaid} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  null,
  mapDispatchToProps
)(InvoicesPage);