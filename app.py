from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load('rf_classifier.pkl')
model_r=joblib.load('rf_regressor.pkl')
model_columns = joblib.load('model_columns.pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        prediction = model.predict([[
            data['N'],
            data['P'],
            data['K'],
            data['temperature'],
            data['humidity'],
            data['ph'],
            data['rainfall']
        ]])[0]
        return jsonify({'result': prediction})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/irrigation',methods=['POST'])
def irrigation():
    try:
        data = request.json
        df = pd.DataFrame([data])

        df = pd.get_dummies(df)
        df = df.reindex(columns=model_columns, fill_value=0)

        prediction = model_r.predict(df)
        return jsonify({'IrrigationAdvice_mm': prediction[0]})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
