import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import TabNavigator from './Navigator/AppRouter.js';

export default class App extends Component {
  /*
  Go to Tab Navigator.
  */
  render() {
    return (<TabNavigator/>);
  }
}