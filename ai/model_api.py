import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
from flask import Flask, request, jsonify

app = Flask(__name__)

print("Loading model and scaler...")
model = tf.keras.models.load_model('model.keras')
scaler = joblib.load('global_scaler.pkl')

features_to_use = ['daily_total_qty', 'rolling_mean', 'rolling_std', 'day_of_week']
WINDOW_SIZE = 31
HORIZON = 5


@app.route('/predict', methods=['POST'])
def predict_demand():
    try:
        data = request.get_json()
        
        history_qty = data.get('past_31_days_qty')
        last_date_str = data.get('last_date')         
        if not history_qty or len(history_qty) != WINDOW_SIZE or not last_date_str:
            return jsonify({
                "error": f"Please provide exactly {WINDOW_SIZE} days of 'past_31_days_qty' and the 'last_date' (YYYY-MM-DD)."
            }), 400

        dates = pd.date_range(end=last_date_str, periods=WINDOW_SIZE)
        
        df = pd.DataFrame({
            'Date': dates,
            'daily_total_qty': history_qty
        })
        
        df['rolling_mean'] = df['daily_total_qty'].rolling(7, min_periods=1).mean()
        df['rolling_std'] = df['daily_total_qty'].rolling(7, min_periods=1).std().fillna(0)
        df['day_of_week'] = df['Date'].dt.dayofweek
        
        df = df[features_to_use]
        
        scaled_input = scaler.transform(df.values)
        
        encoder_in = scaled_input.reshape(1, WINDOW_SIZE, len(features_to_use))
        
        decoder_in = np.zeros((1, HORIZON, 1))
        
        decoder_in[0, 0, 0] = encoder_in[0, -1, 0]
        
        for step in range(HORIZON):
            pred = model.predict([encoder_in, decoder_in], verbose=0)
            
            if step < HORIZON - 1:
                decoder_in[0, step + 1, 0] = pred[0, step, 0]
                
        pred_quantities_scaled = pred[0, :, 0] 
        
        dummy_array = np.zeros((HORIZON, len(features_to_use)))
        dummy_array[:, 0] = pred_quantities_scaled
        
        pred_quantities_real = scaler.inverse_transform(dummy_array)[:, 0]
        final_predictions = [max(0, int(round(x))) for x in pred_quantities_real]

        future_dates = pd.date_range(start=dates[-1] + pd.Timedelta(days=1), periods=HORIZON)
        future_dates_str = [d.strftime('%Y-%m-%d') for d in future_dates]

        return jsonify({
            "status": "success",
            "forecast": [
                {"date": f_date, "predicted_qty": qty}
                for f_date, qty in zip(future_dates_str, final_predictions)
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
