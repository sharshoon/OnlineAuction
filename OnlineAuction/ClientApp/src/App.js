import React, { Component } from 'react';
import { Route } from 'react-router';

import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import './styles.css'
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import AdminPanel from "./components/AdminPanel";
import Lots from "./components/Lots";
import classNames from 'classnames'

export default class App extends Component {
    static displayName = App.name;

    render () {
        const containerClasses = classNames('casing', 'casing__body');
        return (
            <div className={containerClasses}>
                    <Layout className='container'>
                        <Route exact path='/' component={Home} />
                        <Route path='/lots' component={Lots}/>
                        <AuthorizeRoute path='/admin-panel' component={AdminPanel}/>
                        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
                    </Layout>
            </div>
        );
    }
}
