import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  FlatList,
  Linking,
} from 'react-native';

import { Card, CardTitle, CardContent, CardAction, CardButton } from 'react-native-material-cards'

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default class NewsScreen extends React.Component {

  /*
  constructor
  */
  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        dataSource: ""
    }
  }

  /*
  Show the layout of Home Screen.
  */
  render() {

    // data = this.setupData();

    return (
        // console.log(this.state.dataSource),
        <View style={{flex: 1}}>
        <ImageBackground source={require('../images/background.jpg')}  style={{width: screenWidth, height: screenHeight}}>
          {/* {this.renderHeader()} */}
          {this.renderList()}
        </ImageBackground>
        </View>
    );
  }

  setupData() {
    fetch('http://127.0.0.1:5000/api/financial_news')
      .then((response) => response.json())
      .then((result) => {
        this.setState({
            isLoading: false,
            dataSource: result,
        });
        return result;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /*
  Show the layout of Header part.
  */
  renderHeader() {
    return (
      <View style={styles.header}>
          <Text style={styles.headerTitle}>News and Reports</Text>
      </View>
    );
  }

  renderList() {
    this.setupData()
    // console.log(this.state.dataSource)
    return (
        <View style={{marginBottom: 180, paddingTop:30}}>
            <Text style={styles.headerTitle}>News and Reports</Text>
            <FlatList
            data={this.state.dataSource}
            keyExtractor={item => item.title}
            renderItem={({item}) => 
                <Card style={{backgroundColor: `rgba(0, 0, 77, 0.2)`}}>
                    <CardTitle
                        title={item.title}
                    />
                    <CardContent 
                        textStyle={styles.contentPrice}
                        text={item.summary}
                    />
                    <CardAction 
                        separator={true} 
                        inColumn={false}>
                        <CardButton
                        onPress={() => Linking.openURL(item.link)}
                        title="More Details"
                        color="#62698d"
                        />
                    </CardAction>
                </Card>
                }
            />
        </View>
    );
  }
}

/*
styles
*/
const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 10,
    color: '#3d3d5c',
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentTitle: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    color: '#62698d',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 10,
    color: '#8585ad',
    fontSize: 20,
  }
});