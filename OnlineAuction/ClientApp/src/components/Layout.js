import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export function Layout(props) {

    console.log(props);

    return (
      <div>
        <NavMenu />
        <Container>
          {props.children}
        </Container>
      </div>
    );
}
