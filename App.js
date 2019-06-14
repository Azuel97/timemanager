import React, { Component } from 'react'
import { createStackNavigator, createAppContainer,createBottomTabNavigator  } from "react-navigation"
// Navigation
import Login from "./src/navigation/Login"
import DetailsScreen from "./src/navigation/DetailsScreen"
import SearchActivity from "./src/navigation/SearchActivity"
import CalendarActivity from './src/navigation/CalendarActivity'
import AddUsers from './src/navigation/AddUsers'
import DetailsHistory from './src/navigation/DetailsHistory'

// Gestione della navigazione tra le varie schermate
const AppNavigator = createStackNavigator(
{
  Home: Login,
  Details: DetailsScreen,
  Search: SearchActivity,
  Calendar: CalendarActivity,
  AddUser: AddUsers,
  History: DetailsHistory
},
{
  initialRouteName: "Home"
}
);

// BottomNavigationBar
// const TabNavigator = createBottomTabNavigator({  
//   Home: Login,  
//   Details: DetailsScreen,  
// });  

export default createAppContainer(AppNavigator);