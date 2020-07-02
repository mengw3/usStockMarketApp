import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Button,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import LineChart from "react-native-responsive-linechart";
import moment from "moment";
import {ButtonGroup} from 'react-native-elements';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

// Wrap and export
export default function(props) {
  const route = useRoute();
  return <DataScreen {...props} route={route} />;
}

class DataScreen extends React.Component {

  /*
  constructor
  */
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        dataSource: [],
        stockData: [],
        stockIndex: [],
        period: "1mo",
        buttonIndex: 1
    };
    this.selectPeriod = this.selectPeriod.bind(this);
  }

  selectPeriod = (newIndex) => {
    if (newIndex == 0) {
      this.setState({
        buttonIndex: newIndex,
        period: "5d"
      })
    }
    if (newIndex == 1) {
      this.setState({
        buttonIndex: newIndex,
        period: "1mo"
      })
    }
    if (newIndex == 2) {
      this.setState({
        buttonIndex: newIndex,
        period: "3mo"
      })
    }
    if (newIndex == 3) {
      this.setState({
        buttonIndex: newIndex,
        period: "6mo"
      })
    }
    if (newIndex == 4) {
      this.setState({
        buttonIndex: newIndex,
        period: "1y"
      })
    }
    if (newIndex == 5) {
      this.setState({
        buttonIndex: newIndex,
        period: "2y"
      })
    }
    if (newIndex == 6) {
      this.setState({
        buttonIndex: newIndex,
        period: "5y"
      })
    }
    if (newIndex == 7) {
      this.setState({
        buttonIndex: newIndex,
        period: "10y"
      })
    }
    if (newIndex == 8) {
      this.setState({
        buttonIndex: newIndex,
        period: "max"
      })
    }
  }

  /*
  Show the layout of Data Screen.
  */
  render() {

    const { route } = this.props;
    
    data = this.setupData(route.params.symbol, this.state.period);

    const buttons = ['5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'max']

    return (
        // console.log(this.state.period),
        // console.log(this.state.stockIndex),
      console.disableYellowBox = true,
      <View style={{flex: 1}}>
        <ImageBackground source={require('FinancialProject/images/black.jpg')}  style={{width: screenWidth, height: screenHeight}}>
            {this.renderHeader(route.params.name, route.params.symbol, route.params.color, route.params.price, route.params.difference)}
            <ButtonGroup
              selectedIndex={this.state.buttonIndex}
              onPress={this.selectPeriod}
              buttons={buttons}
              containerStyle={{height: 40, backgroundColor: 'transparent', marginTop: 20, borderRadius: 10, borderWidth: 2}}
            />
            {this.renderNewChart(route.params.color)}
        </ImageBackground>
      </View>
    );
  }

  setupData(stock_name, stock_period) {
    fetch('http://127.0.0.1:5000/api/stock_data?stock_name=' + stock_name + '&stock_period=' + stock_period)
      .then((response) => response.json())
      .then((result) => {
        const date = result.index.map(element => moment(element).format("M/D"));
        this.setState({
            isLoading: false,
            dataSource: result,
            stockData: result.data,
            stockIndex: date,
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
  renderHeader(stock_name, stock_symbol, stock_color, stock_price, stock_difference) {
    return (
      <View>
        <Text style = {styles.contentTitle}>{stock_name} ({stock_symbol})</Text>
        <Text style = {styles.contentPrice}>
          <Text style = {{fontSize: 20, fontWeight: 'bold', color: stock_color}}>Current Price: {stock_price}</Text>
          <Text style = {{fontSize: 15, color: stock_color}}>         {stock_difference}</Text>
        </Text>
        <Text style = {styles.content}>recent {this.state.period} data</Text>
      </View>
    );
  }

  renderNewChart(stock_color) {
    const data_temp = this.state.dataSource.data;
    const labels = this.state.stockIndex;
    const config = {
      backgroundColor: "transparent",
      line: {
        visible: true,
        strokeWidth: 5,
        strokeColor: stock_color
      },
      area: {
        visible: false
      },
      tooltip: {
        visible: true,
        labelFormatter: v => v.toFixed(2),
        labelFontSize: 10,
        lineColor: "#777",
        lineWidth: 1,
        circleColor: "#3385ff",
        circleBorderColor: "#3385ff",
        circleBorderWidth: 1,
        boxColor: "#3385ff",
        boxBorderWidth: 1,
        boxBorderColor: "#777",
        boxBorderRadius: 5,
        boxPaddingY: 0,
        boxPaddingX: 0,
        labelColor: "#fff",
        labelFontSize: 20
      },
      grid: {
        visible: false,
        stepSize: 1,
        backgroundColor: "transparent",
      },
      xAxis: {
        visible: false,
        labelFontSize: 5,
        labelColor: "#ffffff"
      },
      yAxis: {
        labelFormatter: v => "$ "+ String(v),
        labelColor: "#ffffff"
      },
      area: {
        visible: false
      },
      insetY: 10,
      insetX: 10
    };
    return (
      <LineChart style={{ flex: 1, alignItems: 'center', marginBottom: 180}} config={config} data={data_temp} xLabels={labels}/>
    );
  }
}

/*
styles
*/
const styles = StyleSheet.create({
  contentTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentPrice: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    color: '#ffffff',
    fontSize: 20,
  }
});