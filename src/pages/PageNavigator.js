import React from 'react';
import {Switch, Route } from 'react-router-dom';
import Swagger from './Swagger/Swagger';
import Home from './Home/Home';
import Login from './Login/Login';

import Member from '../components/Members/Members'
import DisplayCustomer from '../components/Contact/DisplayCustomer';

function PageNavigator() {
    return (
        <Switch>

            <Route path='/swagger'>
                <Swagger/>
            </Route>
            <Route path ='/login'>
                <Login/>
            </Route>

            <Route path ='/member'>
                <Member/>
            </Route>
            
            <Route path='/asd'>
                <DisplayCustomer />
            </Route>

            <Route path='/'>
                <Home/>
            </Route>

            
        </Switch>
    );
}

export default PageNavigator;