import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';
import authService from "./api-authorization/AuthorizeService";
import {UserRoles} from "./api-authorization/ApiAuthorizationConstants";

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor (props) {
        super(props);

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
        this.isAdmin();
    }

    async isAdmin(){
        const isAdmin = await authService.hasRole(UserRoles.Administrator);
        this.setState({
            isAdmin
        })
    }

    async getRole(){
        let role = await authService.getRole();
        if(!role){
            role = "pusto";
        }
        this.setState({role});
    }

    render () {
        return (
            <header>
                <Navbar>
                    <Container>
                        <NavbarBrand tag={Link} to="/">OnlineAuction</NavbarBrand>
                        <Collapse isOpen={!this.state.collapsed} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                                </NavItem>
                                {
                                    this.state.isAdmin &&
                                        <NavItem>
                                            <NavLink tag={Link} classsName="text-dark" to="/admin-panel">Admin Panel</NavLink>
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
