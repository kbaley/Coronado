import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import { bindActionCreators } from 'redux';
import NewInvoice from './NewInvoice';
import { connect } from 'react-redux';
import InvoiceList from "./InvoiceList";
import UploadInvoiceTemplate from "./UploadInvoiceTemplate";
import {Icon} from "../icons/Icon";
import ToggleButton from '@material-ui/lab/ToggleButton';
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
      showPaid: false,
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
        <div style={{float: "right", width: "350px", textAlign: "right", "marginRight": "30px"}}>
          <ToggleButton
            value="check"
            selected={this.state.showPaid}
            onChange={() => {
              this.handleChangeButton(!this.state.showPaid);
            }}
          >
            Show paid
          </ToggleButton>
          <Icon className="show-template" glyph="upload" onClick={this.uploadTemplateForm} />
          <Icon className="show-template" glyph="external-link-alt" onClick={this.showTemplate} />
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