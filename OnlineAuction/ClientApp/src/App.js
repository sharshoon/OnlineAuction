import React, { Component } from 'react';
import { Route } from 'react-router';

import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import { Layout } from './components/Layout';
import { Home } from './components/Home/Home';
import './styles.css'
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import classNames from 'classnames'
import Timer from "./components/Timer/Timer";
import LotsPlug from "./components/LotsPlug/LotsPlug";
import AddLotPage from "./components/AddLotPage/AddLotPage";
import AdminPanelPage from "./components/AdminPanelPage/AdminPanelPage";
import Winners from "./components/Winners/Winners";

export default class App extends Component {
    static displayName = App.name;

    render () {
        const containerClasses = classNames("casing", "casing__body");
        return (
            <div className={containerClasses}>
                    <Layout className='container'>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/timer' component={Timer} />
                        <Route path='/lots/:id?' component={LotsPlug}/>
                        <Route path='/winners' component={Winners}/>
                        <AuthorizeRoute path='/new-lot' component={AddLotPage}/>
                        <AuthorizeRoute path='/admin-panel' component={AdminPanelPage}/>
                        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
                    </Layout>
            </div>
        );
    }
}
