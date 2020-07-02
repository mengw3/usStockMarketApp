import requests as req
from unittest import TestCase


class Test(TestCase):
    def test_api_stock_list(self):
        res = req.get('http://127.0.0.1:5000/api/stock_list')
        assert res.status_code == 200

    def test_api_stock_info(self):
        res = req.get('http://127.0.0.1:5000/api/stock_info?stock_name=MSFT')
        assert res.status_code == 200

    def test_api_stock_data(self):
        res = req.get('http://127.0.0.1:5000/api/stock_data?stock_name=MSFT&stock_period=30d')
        assert res.status_code == 200

    def test_api_financial_news(self):
        res = req.get('http://127.0.0.1:5000/api/financial_news')
        assert res.status_code == 200

    def test_api_send_stock_prediction(self):
        res = req.get('http://127.0.0.1:5000/api/stock_prediction')
        assert res.status_code == 200

    def test_api_send_stock_original(self):
        res = req.get('http://127.0.0.1:5000/api/stock_original')
        assert res.status_code == 200
