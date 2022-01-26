import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import reactLogo from '../../images/react-logo.svg';
import {
  useManagementDispatch,
  useManagementState,
} from '../../context/ManagementContext';
// components
import Widget from '../../components/Widget';

const Dashboard = () => {
  const managementDispatch = useManagementDispatch();
  const managementValue = useManagementState();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(managementValue.currentUser);
  }, [managementDispatch, managementValue]);

  return (
    <div>
      <h1 className='page-title'>
        Welcome, {currentUser ? currentUser.firstName || 'User' : 'User'}!{' '}
        <br />
        <small>
          <small>Your role is {currentUser && currentUser.role}</small>
        </small>
      </h1>

      <Row>
        <Col lg={6}>
          <Widget>
            <Row className={'align-items-center'}>
              <Col md={6}>
                <img src={reactLogo} alt='react' />
              </Col>
            </Row>
          </Widget>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
