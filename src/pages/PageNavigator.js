import React from 'react';
import {Switch, Route } from 'react-router-dom';
import Swagger from './Swagger/Swagger';
import Home from './Home/Home';
import Login from './Login/Login';
import Verify from './Login/Verify';
import DisplayUser from '../components/User/DisplayUser';
import DisplayEvents from '../components/Event/DisplayEvents';
import ToDoList from '../components/ToDoList/ToDoList';

function PageNavigator() {
    return (
        <Switch>

            <Route path='/swagger'>
                <Swagger/>
            </Route>
            <Route path ='/login'>
                <Login/>
            </Route>
            {/* <Route path='/todo'>
                <ToDoList/>
            </Route> */}
            <Route path ='/verify'>
                <Verify/>
            </Route>
            <Route path ='/user'>
                <DisplayUser/>
            </Route>
            {/* <Route path ='/events'>
                <DisplayEvents/>
            </Route> */}
            <Route path='/'>
                <Home/>
            </Route>
            
        </Switch>
    );
}

export default PageNavigator;