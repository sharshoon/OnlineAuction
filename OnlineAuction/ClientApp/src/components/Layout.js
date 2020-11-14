import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu/NavMenu';
import classNames from "classnames";

export function Layout(props) {
    return (
        <div>
            <NavMenu/>
            <Container>
              {props.children}
            </Container>
        </div>
    );
}
