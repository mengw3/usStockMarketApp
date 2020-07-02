import json
from flask import Flask, jsonify, abort, request, render_template
import yfinance as yf
import matplotlib.pyplot as plt
import csv
import json
import requests
from bs4 import BeautifulSoup
import math
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
import matplotlib.pyplot as plt
plt.style.use('fivethirtyeight')

app = Flask(__name__)


@app.route('/api/stock_info', methods=['GET'])
def get_stock_info():
    """
    get a stock's general information
    :return: general information
    """
    stock_name = request.args.get('stock_name')
    result = yf.Ticker(stock_name)
    info = result.info
    # for key, value in info.items():
    #     print(key, value)
    return info, 200


@app.route('/api/stock_data', methods=['GET'])
def get_stock_data():
    """
    get stock's historical market data
    :return: historical market price
    """
    stock_name = request.args.get('stock_name')
    stock_period = request.args.get('stock_period')
    result = yf.Ticker(stock_name)
    hist = result.history(period=stock_period)
    # print(hist)
    hist_close = hist['Close']
    hist_string = hist_close.to_json(orient='split')
    # print(type(hist_string))
    hist_json = json.loads(hist_string)
    # print(type(hist_json))
    hist.to_csv(stock_name + ' data' + '.csv')
    return hist_json, 200


@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    stock_name = request.args.get('stock_name')
    result = yf.Ticker(stock_name)
    recommendations = result.recommendations
    # print(type(recommendations))
    recommendations_string = recommendations.to_json(orient='split')
    # print(type(recommendations_string))
    recommendations_json = json.loads(recommendations_string)
    # print(type(recommendations_json))
    recommendations.to_csv(stock_name + ' recommendations' + '.csv')
    return recommendations_string, 200


def download_stock_data(stock_name, start_time, end_time):
    """
    Download stock data then export as CSV
    :param stock_name: stock name
    :param start_time: start time of historical data
    :param end_time: end time of historical data
    :return: nothing
    """
    data_df = yf.download(stock_name, start=start_time, end=end_time)
    # print(data_df)
    data_df.to_csv(stock_name + '.csv')


def plot_stock_data(stock_name, stock_period):
    # Plot everything by leveraging the very powerful matplotlib package
    # stock_name = request.args.get('stock_name')
    # stock_period = request.args.get('stock_period')
    result = yf.Ticker(stock_name)
    hist = result.history(period=stock_period)
    # print(hist['Close'])
    chart = hist['Close'].plot(figsize=(16, 9))
    # print(type(chart))
    plt.show(chart)
    # print(chart)


@app.route('/api/stock_list', methods=['GET'])
def get_stock_list():
    output = []
    with open('AllStocks/stock_list.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                # print(f'Column names are {", ".join(row)}')
                line_count += 1
            else:
                result = yf.Ticker(row[0])
                hist = result.history(period="2d")
                hist_close = hist['Close']
                hist_string = hist_close.to_json(orient='split')
                hist_json = json.loads(hist_string)
                # print(f'stock symbol: {row[0]}, stock name: {row[1]}, close price: {hist_json["data"][0]}')
                # print(row[0])
                # print(row[1])
                # if not hist_json["data"][1]:
                #     hist_json["data"][1] = ["N/A"]
                #     color = "white"
                #     difference = 0
                # print(hist_json["data"][0])
                # else:
                if hist_json["data"][1] < hist_json["data"][0]:
                    color = "red"
                else:
                    if hist_json["data"][1] == hist_json["data"][0]:
                        color = "white"
                    else:
                        color = "green"
                difference = round(hist_json["data"][1] - hist_json["data"][0], 2)
                if difference > 0:
                    difference = "+" + str(difference)
                data = {"stock_symbol": row[0], "stock_name": row[1], "close_price": hist_json["data"][1], "color": color, "difference": difference}
                output.append(data)
                line_count += 1
        print(f'Processed {line_count} lines.')
        return jsonify(output), 200


@app.route('/api/financial_news', methods=['GET'])
def get_news():
    output = []
    url_news = "https://wallmine.com/news/market/us"
    page = requests.get(url_news)
    soup = BeautifulSoup(page.content, "html.parser")
    contents_check = soup.findAll('li', class_="page-item")
    print(contents_check[len(contents_check)-2].text)
    num = int(contents_check[len(contents_check)-2].text) + 1
    for x in range(1, num):
        print(x)
        url_news = "https://wallmine.com/news/market/us/" + str(x)
        page = requests.get(url_news)
        soup = BeautifulSoup(page.content, "html.parser")
        contents = soup.findAll('div', class_="container news-card")
        # print(contents)
        for news in contents:
            data = {}
            news_content = news.find('div', class_="col-md-10 col--text").find("a")
            link = "https://wallmine.com" + news_content['href']
            data['link'] = link
            # print(link)
            title = news_content.find("h2").text
            data['title'] = title
            # print(title)
            summary = news_content.find('p', class_="news-card__excerpt").text
            data['summary'] = summary
            # print(summary)
            output.append(data)
    return jsonify(output), 200


@app.route('/api/stock_prediction', methods=['GET'])
def send_stock_prediction():
    # get_stock_prediction()
    with open('prediction_data.json') as file:
        file_data = json.load(file)
        return file_data, 200


@app.route('/api/stock_original', methods=['GET'])
def send_stock_original():
    # get_stock_prediction()
    with open('original_data.json') as file:
        file_data = json.load(file)
        return file_data, 200


# if __name__ == "__main__":
#     print("Start")
#     # info_data = get_stock_info()
#     # for key, value in info_data.items():
#     #     print(key, value)
#     # print(get_stock_data())
#     # download_stock_data("MSFT", "2020-02-01", "2020-03-20")
#     # plot_stock_data("MSFT", "1mo")
#     get_stock_prediction()
#     print("Finished")

if __name__ == '__main__':
    app.run(debug=True)
