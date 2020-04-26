import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import NavMenu from './NavMenu';
import './Layout.css';
import NotificationsComponent from './Notifications';
import { ShortcutHelper } from './common/ShortcutHelper';
import { Icon } from "./icons/Icon";
import Sidebar from './Sidebar';

export default props => (
  <Container fluid>
    <Row>
      <Col className='sidebar'>
        <Sidebar />
      </Col>
      <Col className='mainContent'>
        <div style={{textAlign: "right", marginTop: 4}}>
          <Icon glyph="sign-out-alt" onClick={() => { localStorage.removeItem('coronado-user'); window.location.reload(true);}} />
        </div>
        {props.children}
      </Col>
    </Row>
    <NotificationsComponent />
    <ShortcutHelper />
  </Container>
);
