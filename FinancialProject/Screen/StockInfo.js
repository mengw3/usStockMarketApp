import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  InteractionManager,
  Switch,
  TouchableOpacity,
  findNodeHandle,
} from 'react-native';

import { useRoute } from '@react-navigation/native';

import { BlurView } from '@react-native-community/blur';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

// Wrap and export
export default function(props) {
  const route = useRoute();
  return <InfoScreen {...props} route={route} />;
}

class InfoScreen extends React.Component {

  /*
  constructor
  */
  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        dataSource: [],
        viewRef: null,
        blurType: 'dark',
    }
  }

  /*
  Show the layout of Info Screen.
  */
  render() {

    const { route } = this.props;

    data = this.setupData(route.params.symbol);

    return (
      console.disableYellowBox = true,
      <View style={styles.container}>
        <Image
          source={{uri: this.state.dataSource.logo_url}}
          style={styles.image}
          ref={'backgroundImage'}
          onLoadEnd={this.imageLoaded.bind(this)} 
        />
        {this.renderBlurView(route.params.name)}
      </View>
    );

  }

  setupData(stock_name) {
    fetch('http://127.0.0.1:5000/api/stock_info?stock_name=' + stock_name)
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

  imageLoaded() {
    // Workaround for a tricky race condition on initial load.
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        this.setState({ viewRef: findNodeHandle(this.refs.backgroundImage) });
      }, 500);
    });
  }

  setBackgroundLight() {
    //To make light background
    this.setState({
      blurType: 'light',
    });
  }
  setBackgroundDark() {
    //To make dark light background
    this.setState({
      blurType: 'dark',
    });
  }

  renderBlurView(stock_name) {
    return (
      <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
       {this.state.viewRef && 
       <BlurView
          viewRef={this.state.viewRef}
          style={styles.blurView}
          blurType={this.state.blurType}
          blurRadius={20}
          downsampleFactor={25}
          overlayColor={'rgba(0, 0, 255, .6)'}
        />}
        <ScrollView style = {{flex: 1}}>
          {this.renderHeader(stock_name)}
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
            <TouchableOpacity
                style={styles.button}
                onPress={(this.state.blurType == "dark") ? this.setBackgroundLight.bind(this) : this.setBackgroundDark.bind(this) }>
                <Image
                  style={styles.button}
                  source={require('../images/switch.png')}
                />
            </TouchableOpacity>
          </View>
          {this.renderInfo()}
        </ScrollView>  
      </View>
    );
  }


  /*
  Show the layout of Header part.
  */
  renderHeader(stock_name) {
    const tintColor = ['#ffffff', '#000000']; 
    if (this.state.blurType === 'light') {tintColor.reverse();}

    return (
        <View style={styles.header}>
            <Text style={[styles.headerTitle, {color: tintColor[0]}]}>{stock_name}</Text>
        </View>
    );
  }

  renderInfo() {
    const tintColor = ['#ffffff', '#000000']; 
    if (this.state.blurType === 'light') {tintColor.reverse();}

    return (
        <View style={styles.header}>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Symbol</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.symbol}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Business Summary</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.longBusinessSummary}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Logo Url</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.logo_url}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Sector</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.sector}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Industry</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.industry}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Full Time Employees</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.fullTimeEmployees}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>City</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.city}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>State</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.state}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Zip Code</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.zip}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Country</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.country}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Website</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.website}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Phone</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.phone}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Fax</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.fax}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Market</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.market}</Text>

            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Exchange</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.exchange}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Exchange Time-zone Name</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.exchangeTimezoneName}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Exchange Time-zone Short Name</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.exchangeTimezoneShortName}</Text>
            
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Day High</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.dayHigh}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Day Low</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.dayLow}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Ask</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.ask}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Bid</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.bid}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Bid Size</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.bidSize}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Regular Market Price</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.regularMarketPrice}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Previous Close</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.previousClose}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Regular Market Open</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.regularMarketOpen}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Two Hundred Day Average</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.twoHundredDayAverage}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Trailing Annual Dividend Yield</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.trailingAnnualDividendYield}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Payout Ratio</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.payoutRatio}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Regular Market Day High</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.regularMarketDayHigh}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Regular Market Day Low</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.regularMarketDayLow}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Average Volume 10 Days</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.averageVolume10days}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Regular Market Volume</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.regularMarketVolume}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Average Volume</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.averageVolume}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Total Assets</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.totalAssets}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Regular Market Previous Close</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.regularMarketPreviousClose}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Fifty Day Average</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.fiftyDayAverage}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Trailing Annual Dividend Rate</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.trailingAnnualDividendRate}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Open</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.open}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Dividend Rate</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.dividendRate}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Ex Dividend Date</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.exDividendDate}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Beta</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.beta}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Price Hint</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.priceHint}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Currency</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.currency}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Trailing PE</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.trailingPE}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Forward PE</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.forwardPE}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Market Cap</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.marketCap}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Price To Sales Trailing 12 Months</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.priceToSalesTrailing12Months}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Fifty Two Week High</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.fiftyTwoWeekHigh}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Fifty Two Week Low</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.fiftyTwoWeekLow}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Five Year Avg Dividend Yield</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.fiveYearAvgDividendYield}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Dividend Yield</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.dividendYield}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>GMT OffSet Milliseconds</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.gmtOffSetMilliseconds}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Quote Type</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.quoteType}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Message Board Id</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.messageBoardId}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Enterprise To Revenue</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.enterpriseToRevenue}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Profit Margins</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.profitMargins}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Enterprise To Ebitda</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.enterpriseToEbitda}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Trailing Eps</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.trailingEps}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>forwardEps</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.forwardEps}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Shares Outstanding</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.sharesOutstanding}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Book Value</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.bookValue}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Shares Short</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.sharesShort}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Shares Percent Shares Out</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.sharesPercentSharesOut}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Last Fiscal Year End</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.lastFiscalYearEnd}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Next Fiscal Year End</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.nextFiscalYearEnd}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Held Percent Institutions</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.heldPercentInstitutions}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Net Income To Common</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.netIncomeToCommon}</Text>
            {/* <Text style={[styles.contentTitle, {color: tintColor[0]}]}>52 Week Change</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.52WeekChange}</Text> */}
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>SandP 52 Week Change</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.SandP52WeekChange}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Price To Book</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.priceToBook}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Held Percent Insiders</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.heldPercentInsiders}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Most Recent Quarter</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.mostRecentQuarter}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Short Ratio</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.shortRatio}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Shares Short Previous Month Date</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.sharesShortPreviousMonthDate}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Float Shares</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.floatShares}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Enterprise Value</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.enterpriseValue}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Last Split Date</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.lastSplitDate}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Last Split Factor</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.lastSplitFactor}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Earnings Quarterly Growth</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.earningsQuarterlyGrowth}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Date Short Interest</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.dateShortInterest}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Peg Ratio</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.pegRatio}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Short Percent Of Float</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.shortPercentOfFloat}</Text>
            <Text style={[styles.contentTitle, {color: tintColor[0]}]}>Shares Short Prior Month</Text>
            <Text style={[styles.content, {color: tintColor[0]}]}>{this.state.dataSource.sharesShortPriorMonth}</Text>
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
    marginTop: 20,
    marginBottom: 10,
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentTitle: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'cover',
    width: null,
    height: null,
  },
  blurView: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color:"#d0d0d0"
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width:50,
    height: 50,
    resizeMode: 'contain',
  },
});