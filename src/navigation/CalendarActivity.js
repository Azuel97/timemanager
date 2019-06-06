import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native'
// Calendar component
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

class CalendarActivity extends React.Component {

    // Modifica la navigationBar
    static navigationOptions = ({ navigation }) => ({
        title: 'TimeManager',
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'lightgrey'
        }
      });

    render() {
        return (
           <View style = {styles.container}>
              <CalendarList current={'2019-06-09'}
                 markingType={'custom'}
                 markedDates={{
                    '2019-06-01': {
                        customStyles: {
                          container: {
                            backgroundColor: 'lightgrey'
                          },
                        },
                      },
                   '2019-06-02': {
                     customStyles: {
                       container: {
                         backgroundColor: 'lightgreen'
                       },
                     },
                   },
                   '2019-06-03': {
                    customStyles: {
                      container: {
                        backgroundColor: 'lightgreen'
                      },
                    },
                  },
                  '2019-06-04': {
                    customStyles: {
                      container: {
                        backgroundColor: '#FF6666'
                      },
                    },
                  },
                  '2019-06-05': {
                    customStyles: {
                      container: {
                        backgroundColor: 'lightgreen'
                      },
                    },
                  },
                  '2019-06-06': {
                    customStyles: {
                      container: {
                        backgroundColor: 'lightgreen'
                      },
                    },
                  },
                  '2019-06-07': {
                    customStyles: {
                      container: {
                        backgroundColor: 'lightgrey'
                      },
                    },
                  },
                  '2019-06-08': {
                    customStyles: {
                      container: {
                        backgroundColor: 'lightgrey'
                      },
                    },
                  },
                 }}/>
           </View>
        )
     }
}

export default CalendarActivity;

 const styles = StyleSheet.create({
    container: {
       paddingTop: 5
    },
 })