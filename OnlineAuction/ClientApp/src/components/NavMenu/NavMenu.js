import React, { Component } from 'react';
import {Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import classNames from "classnames"

import { Link } from 'react-router-dom';
import { LoginMenu } from '../api-authorization/LoginMenu';
import './NavMenu.css';
import '../../styles.css';
import authService from "../api-authorization/AuthorizeService";
import {UserRoles} from "../api-authorization/ApiAuthorizationConstants";

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor (props) {
        super(props);
        this.state = {
            collapsed: true,
            isAdmin : false,
            role : "none"
        };
        this.titleClasses = classNames("title", "logo");
        this.headerClasses = classNames("casing__header", "header", "container-border");
        this.toggleNavbar = this.toggleNavbar.bind(this);
    }

    toggleNavbar () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    componentDidMount() {
        this.subsctibeId = authService.subscribe(() => this.isAdmin());
        this.isAdmin();
    }

    componentWillUnmount() {
        authService.unsubscribe(this.subsctibeId);
    }

    async isAdmin(){
        const isAdmin = await authService.hasRole(UserRoles.Administrator);
        this.setState({
            isAdmin
        })
    }

    render () {
        this.buttonsWrapperClasses = classNames("header__buttons-wrapper", {"header__buttons-wrapper--open" : !this.state.collapsed});
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
                        <a className="header__menu-button header__menu-button--hidden" onClick={() => this.toggleNavbar()}>
                            <div className="menu-icon-bar"/>
                            <div className="menu-icon-bar"/>
                            <div className="menu-icon-bar"/>
                        </a>
                        <ul className={this.buttonsWrapperClasses}>
                            <NavItem>
                                <NavLink className='header__button' tag={Link} to="/">Home</NavLink>
                            </NavItem>
                            {
                                this.state.isAdmin &&
                                    <NavItem>
                                        <NavLink className='header__button' tag={Link} to="/new-lot">New Lot</NavLink>
                                    </NavItem>
                            }
                            <NavItem>
                                <NavLink className='header__button' tag={Link} to="/winners">Winners</NavLink>
                            </NavItem>
                            <LoginMenu>
                            </LoginMenu>
                        </ul>
                    </Container>
                </Navbar>
            </header>
        );
    }
}
