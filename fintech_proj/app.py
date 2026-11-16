# app.py
from flask import Flask, render_template, jsonify, request
from fugle_marketdata import RestClient
import pandas as pd
from flask import send_file
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('FUGLE_API_KEY')


app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

# 初始化 Fugle API 客戶端
client = RestClient(api_key=API_KEY)
stock = client.stock  # Stock REST API client

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_data")
def get_data():
    try:
        # 取得前端傳遞過來的股票代號
        symbol = request.args.get('symbol', default='', type=str)

        if not symbol:
            return jsonify({"error": "請提供股票代號"}), 400

        # 取得個股最新交易日的基本資訊
        intraday_data = stock.historical.candles(**{"symbol": symbol, "from": "2022-01-01", "to": "2022-12-31", "timeframe" : "M", "fields": "open,high,low,close,volume,change"})
        
        # 返回取得的數據
        return jsonify(intraday_data)
    except Exception as e:
        return jsonify({"error": f"API 呼叫失敗: {str(e)}"}), 500
    

@app.route("/gettest")
def gettest():
    try:
        # 嘗試讀取 CSV 檔案
        df = pd.read_csv('資訊透明度.csv')

        # 取得前端傳遞過來的股票代號
        symbol = request.args.get('symbol', default='', type=str)

        # 將 DataFrame 轉換為 JSON 字串
        json_data = df.to_json(orient='records')
        return jsonify(json_data)
    
    except Exception as e:
        # 如果發生錯誤，回傳錯誤訊息和錯誤碼
        return jsonify({"error": f"讀取 CSV 檔案失敗: {str(e)}"}), 500
    
@app.route("/getInfo")
def getInfo():
    try:
        # 嘗試讀取 CSV 檔案
        df = pd.read_csv('基本資訊.csv')

        # 取得前端傳遞過來的股票代號
        symbol = request.args.get('symbol', default='', type=str)

        # 將 DataFrame 轉換為 JSON 字串
        df = df[df["上市別"] == "TSE"]
        json_data = df.to_json(orient='records')
        return jsonify(json_data)
    
    except Exception as e:
        # 如果發生錯誤，回傳錯誤訊息和錯誤碼
        return jsonify({"error": f"讀取 CSV 檔案失敗: {str(e)}"}), 500


@app.route("/getNews")
def getNews():
    try:
        # 嘗試讀取 CSV 檔案
        df = pd.read_csv('新聞.csv')

        # 取得前端傳遞過來的股票代號
        symbol = request.args.get('symbol', default='', type=str)

        if not symbol:
            return jsonify({"error": "請提供股票代號"}), 400

        # 取得指定個股資訊
        stock_data = df[df["證券代碼"].str.startswith(str(symbol))]

        # 將 DataFrame 轉換為 JSON 字串
        json_data = stock_data.to_json(orient='records')
        return jsonify(json_data)
    
    except Exception as e:
        # 如果發生錯誤，回傳錯誤訊息和錯誤碼
        return jsonify({"error": f"讀取 CSV 檔案失敗: {str(e)}"}), 500
    

@app.route("/getContral")
def getContral():
    try:
        # 嘗試讀取 CSV 檔案
        df = pd.read_csv('contral_clean_2.csv')

        # 取得前端傳遞過來的股票代號
        symbol = request.args.get('symbol', default='', type=str)

        if not symbol:
            return jsonify({"error": "請提供股票代號"}), 400

        # 取得指定個股資訊
        stock_data = df[df["證券代碼"].str.startswith(str(symbol))]

        # 將 DataFrame 轉換為 JSON 字串
        
        json_data = stock_data.to_json(orient='records')
        return jsonify(json_data)
    except Exception as e:
        # 如果發生錯誤，回傳錯誤訊息和錯誤碼
        return jsonify({"error": f"讀取 CSV 檔案失敗: {str(e)}"}), 500
        
@app.route("/getlocaldata")
def getlocaldata():
    try:
        # 嘗試讀取 CSV 檔案
        dataset_name = request.args.get('dataset', type=str)
        #全部一起抓，剩下的交給後面過濾
        df = pd.read_csv(dataset_name)
        
        json_data = df.to_json(orient='records', force_ascii=False)#不這樣做會一堆亂碼
    
        return jsonify(json_data)
    
    except Exception as e:
        # 如果發生錯誤，回傳錯誤訊息和錯誤碼
        return jsonify({"error": f"讀取 CSV 檔案失敗: {str(e)}"}), 500
    
    
@app.route("/getShareType")
def getShareType():
    try:
        # 嘗試讀取 CSV 檔案
        df = pd.read_csv('share_type.csv')

        # 取得前端傳遞過來的股票代號
        symbol = request.args.get('symbol', default='', type=str)

        if not symbol:
            return jsonify({"error": "請提供股票代號"}), 400

        # 取得指定個股資訊
        stock_data = df[df["證券代碼"].str.startswith(str(symbol))]

        # 將 DataFrame 轉換為 JSON 字串
        json_data = stock_data.to_json(orient='records')
        return jsonify(json_data)
    except Exception as e:
        # 如果發生錯誤，回傳錯誤訊息和錯誤碼
        return jsonify({"error": f"讀取 CSV 檔案失敗: {str(e)}"}), 500


@app.route("/getSalary")
def getSalary():
    try:
        # 嘗試讀取 CSV 檔案
        df = pd.read_csv('salary.csv')

        # 取得前端傳遞過來的股票代號
        symbol = request.args.get('symbol', default='', type=str)

        if not symbol:
            return jsonify({"error": "請提供股票代號"}), 400

        # 取得指定個股資訊
        stock_data = df[df["證券代碼"].str.startswith(str(symbol))]

        # 將 DataFrame 轉換為 JSON 字串
        json_data = stock_data.to_json(orient='records')
        return jsonify(json_data)
    except Exception as e:
        # 如果發生錯誤，回傳錯誤訊息和錯誤碼
        return jsonify({"error": f"讀取 CSV 檔案失敗: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
    
    
