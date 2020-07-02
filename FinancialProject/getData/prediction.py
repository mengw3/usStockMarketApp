import yfinance as yf
import math
import json
import csv
import pandas_datareader as web
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
import tensorflow as tf
import matplotlib.pyplot as plt
plt.style.use('fivethirtyeight')


def get_stock_prediction():
    output_p = {}
    output_c = {}
    with open('AllStocks/stock_list.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                # print(f'Column names are {", ".join(row)}')
                line_count += 1
            else:
                print(row[0])

                result = yf.Ticker(row[0])
                hist = result.history(period="max")
                hist_close = hist.filter(['Close'])
                dataset = hist_close.values
                training_data_len = math.ceil(len(dataset)*.8)

                # scale the data
                scaler = MinMaxScaler(feature_range=(0, 1))
                scaled_data = scaler.fit_transform(dataset)
                # print(scaled_data)

                # create the training dataset
                train_data = scaled_data[0:training_data_len, :]
                x_train = []  # independent training variables
                y_train = []  # dependent training variables
                for i in range(60, len(train_data)):
                    # x_train contains the past 60 values
                    x_train.append(train_data[i-60:i, 0])
                    # y_train contains the 61th value, which is the value we want our model to predict
                    y_train.append(train_data[i, 0])
                    # if i <= 61:
                    #     print(x_train)
                    #     print(y_train)

                # convert the x_train and y_train to numpy array
                x_train, y_train = np.array(x_train), np.array(y_train)
                x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
                # print(x_train.shape)

                # build the LSTM model
                model = Sequential()
                model.add(LSTM(50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
                model.add(LSTM(50, return_sequences=False))
                model.add(Dense(25))
                model.add(Dense(1))

                # compile the model
                model.compile(optimizer='adam', loss='mean_squared_error')

                # train the model
                model.fit(x_train, y_train, batch_size=1, epochs=1)

                # create the testing dataset
                test_data = scaled_data[training_data_len - 60:, :]
                x_test = []
                y_test = dataset[training_data_len:, :]
                for i in range(60, len(test_data)):
                    x_test.append(test_data[i-60:i, 0])

                # convert the data to a numpy array
                x_test = np.array(x_test)

                # reshape the data
                x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

                # get the models predicted price values
                predictions = model.predict(x_test)
                predictions = scaler.inverse_transform(predictions)

                # get the root mean squared error (RMSE)
                # rmse = np.sqrt(np.mean(((predictions - y_test) ** 2)))
                # print(rmse)

                # plot the data
                train = hist_close[:training_data_len]
                valid = hist_close[training_data_len:]
                valid['Predictions'] = predictions
                plt.figure(figsize=(16, 8))
                plt.title('Model')
                plt.xlabel('Date', fontsize=18)
                plt.ylabel('Close Price USD ($)', fontsize=18)
                plt.plot(train['Close'])
                plt.plot(valid[['Close', 'Predictions']])
                plt.legend(['Train', 'Val', 'Predictions'], loc='lower right')
                plt.show()

                # show valid and predicted price
                prediction_df = valid['Predictions']
                print(valid['Predictions'])
                prediction_string = prediction_df.to_json(orient='split')
                # print(type(prediction_string))
                prediction_json = json.loads(prediction_string)
                # print(type(prediction_json))
                # print(prediction_json)
                output_p[row[0]] = prediction_json

                # show original close price
                real_df = valid['Close']
                # print(valid['Predictions'])
                real_string = real_df.to_json(orient='split')
                # print(type(prediction_string))
                real_json = json.loads(real_string)
                # print(type(prediction_json))
                # print(prediction_json)
                output_c[row[0]] = real_json

                # prediction for tomorrow
                last_60_days = hist_close[-60:].values
                last_60_days_scaled = scaler.transform(last_60_days)
                X_test = []
                X_test.append(last_60_days_scaled)
                X_test = np.array(X_test)
                X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
                pred_price = model.predict(X_test)
                pred_price = scaler.inverse_transform(pred_price)
                # print(pred_price[0][0])
                # pred_result = {"pred": str(pred_price[0][0])}
                pred_json = json.loads(str(pred_price[0][0]))
                # print(pred_json)
                output_p[row[0] + "-pred"] = pred_json
    with open('prediction_data.json', 'w') as outfile:
        content = json.dumps(output_p, ensure_ascii=False, indent=4)
        outfile.write(content)
        outfile.close()
    with open('original_data.json', 'w') as outfile:
        content = json.dumps(output_c, ensure_ascii=False, indent=4)
        outfile.write(content)
        outfile.close()

    # last_60_days = hist_close[-60:].values
    # last_60_days_scaled = scaler.transform(last_60_days)
    # X_test = []
    # X_test.append(last_60_days_scaled)
    # X_test = np.array(X_test)
    # X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
    # pred_price = model.predict(X_test)
    # pred_price = scaler.inverse_transform(pred_price)
    # print(pred_price)


if __name__ == "__main__":
    print("Start")
    get_stock_prediction()
    print("Finished")
