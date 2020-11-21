import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import classNames from "classnames"

import { Link } from 'react-router-dom';
import { LoginMenu } from '../api-authorization/LoginMenu';
import './NavMenu.css';
import '../../styles.css';
import authService from "../api-authorization/AuthorizeService";
import {UserRoles} from "../api-authorization/ApiAuthorizationConstants";
import '../../styles.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;


    constructor (props) {
        super(props);

        this.titleClasses = classNames("title", "logo");
        this.headerClasses = classNames('casing__header', 'header', "container-border");
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            isAdmin : false,
            role : "none"
        };
    }

    toggleNavbar () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    componentDidMount() {
        authService.subscribe(() => this.isAdmin());
        this.isAdmin();
    }

    async isAdmin(){
        const isAdmin = await authService.hasRole(UserRoles.Administrator);
        this.setState({
            isAdmin
        })
    }

    render () {
        return (
            <header>
                <Navbar>
                    <Container className={this.headerClasses}>
                        <div className='header__logo'>
                            <h1 className='header__title'>
                                <NavbarBrand className={this.titleClasses} tag={Link} to="/">Online Auction</NavbarBrand>
                            </h1>
                            <div className="header__logo-description">
                                The biggest online auction platform in solar system!
                            </div>
                        </div>
                        <Collapse isOpen={!this.state.collapsed} navbar>
                            <ul className='header__buttons-wrapper'>
                                <NavItem>
                                    <NavLink className='header__button' tag={Link} to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='header__button' tag={Link} to='/lots'>Lots</NavLink>
                                </NavItem>
                                {
                                    this.state.isAdmin &&
                                        <NavItem>
                                            <NavLink className='header__button' tag={Link} to="/admin-panel">Admin Panel</NavLink>
                                        </NavItem>
                                }
                                <LoginMenu>
                                </LoginMenu>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}
