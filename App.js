import React, { Component } from 'react'
import { createStackNavigator, createAppContainer } from "react-navigation"
// Navigation
import Login from "./src/navigation/Login"
import DetailsScreen from "./src/navigation/DetailsScreen"
import SearchActivity from "./src/navigation/SearchActivity"
import CalendarActivity from './src/navigation/CalendarActivity';

const AppNavigator = createStackNavigator(
{
  Home: Login,
  Details: DetailsScreen,
  Search: SearchActivity,
  Calendar: CalendarActivity
},
{
  initialRouteName: "Home"
}
);

export default createAppContainer(AppNavigator);