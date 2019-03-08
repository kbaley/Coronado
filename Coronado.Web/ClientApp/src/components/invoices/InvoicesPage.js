import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import { bindActionCreators } from 'redux';
import NewInvoice from './NewInvoice';
import { connect } from 'react-redux';
import InvoiceList from "./InvoiceList";
import UploadInvoiceTemplate from "./UploadInvoiceTemplate";
import {Icon} from "../icons/Icon";
import './InvoicesPage.css';

export class InvoicesPage extends Component {
  constructor(props) {
    super(props);
    this.showTemplate = this.showTemplate.bind(this);
    this.uploadTemplateForm = this.uploadTemplateForm.bind(this);
    this.state = {
      showUploadForm: false
    }
  }

  showTemplate() {
    window.open("/invoice/GenerateHTML");
  }

  uploadTemplateForm() {
    this.setState({showUploadForm: true});
  }

  uploadTemplate(file) {
    console.log(this.props);
    
    this.props.actions.uploadTemplate(file);
    
  }

  render() {
    return (
      <div>
        <div style={{float: "right", width: "150px", textAlign: "right"}}>
          <Icon className="show-template" glyph="upload" onClick={this.uploadTemplateForm} />
          <Icon className="show-template" glyph="new-window" onClick={this.showTemplate} />
          <UploadInvoiceTemplate show={this.state.showUploadForm} onHide={() => this.setState({showUploadForm: false})}
            onUpload={this.uploadTemplate}/>
        </div>
        <h1>
          Invoices <NewInvoice />
        </h1>
        <InvoiceList invoices={this.props.invoices} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    invoices: state.invoices,
  }
}

function mapDispatchToProps(dispatch) {
   return {
     actions: bindActionCreators(actions, dispatch)
   }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoicesPage);