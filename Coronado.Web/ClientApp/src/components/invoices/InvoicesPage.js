import React from 'react';
import * as actions from '../../actions/invoiceActions';
import NewInvoice from './NewInvoice';
import { useDispatch } from 'react-redux';
import InvoiceList from "./InvoiceList";
import UploadInvoiceTemplate from "./UploadInvoiceTemplate";
import {Icon} from "../icons/Icon";
import ToggleButton from '@material-ui/lab/ToggleButton';
import './InvoicesPage.css';
import PublishIcon from '@material-ui/icons/Publish';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

export default function InvoicesPage() {
  const [showUploadForm, setShowUploadForm] = React.useState(false);
  const [ showPaid, setShowPaid ] = React.useState(false);
  const dispatch = useDispatch();

  const showTemplate = () => {
    window.open("/invoice/GenerateHTML");
  }

  const uploadTemplateForm = () => {
    setShowUploadForm(true);
  }

  const uploadTemplate = (file) => {
    dispatch(actions.uploadTemplate(file));
  }

  const handleChangeButton = (value) => {
    setShowPaid(value);
  }

    return (
      <div>
        <div style={{float: "right", width: "350px", textAlign: "right", "marginRight": "30px"}}>
          <ToggleButton
            value="check"
            selected={showPaid}
            onChange={() => {
              handleChangeButton(!showPaid);
            }}
          >
            Show paid
          </ToggleButton>
          <Icon 
            onClick={uploadTemplateForm}
            icon={<PublishIcon />}
          />
          <Icon 
            onClick={showTemplate}
            icon={<OpenInNewIcon />}
          />
          <UploadInvoiceTemplate show={showUploadForm} onHide={() => setShowUploadForm(false)}
            onUpload={uploadTemplate}/>
        </div>
        <h1>
          Invoices <NewInvoice />
        </h1>
        <InvoiceList showPaid={showPaid} />
      </div>
    );
}
