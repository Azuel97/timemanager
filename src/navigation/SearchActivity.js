import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native'

class SearchActivity extends React.Component {

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
        <View>
          <TextInput style = {styles.input}
                 underlineColorAndroid = "transparent"
                 placeholder = "Search"
                 placeholderTextColor = "#434A53"
                 autoCapitalize = "none"
                 onChangeText = {this.handleEmail}/>
          
          <Text style={{position:'absolute',top:80,fontFamily:'Arial', fontSize:16, marginLeft:20}}>Lista Progetti : </Text>
  
          {/* -- Uso della FlatList -- */}
          
          <FlatList
            style={{position:'absolute',top:110,marginLeft:20}}
            data={[
              {name: 'Amministrazione'},
              {name: 'Assistenza'},
              {name: 'Video'},
              {name: 'Applicazioni Spese'},
              {name: 'Applicazione ABC'},
              {name: 'Applicazione BCD'},
              {name: 'Apllicazione CDE'},
              {name: 'Assistenza'}
            ]}
          renderItem={({item}) => <Text style={styles.item}>{item.name}</Text>}
          />
  
        </View>
      );
    }
  }

  export default SearchActivity;

 const styles = StyleSheet.create({
    input: {
       margin: 15,
       height: 40,
       borderColor: 'grey',
       borderWidth: 1,
       paddingLeft: 15
    },
    item: {
     padding: 10,
     fontSize: 16,
     height: 44,
   },
 })