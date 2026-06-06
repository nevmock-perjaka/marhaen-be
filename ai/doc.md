# Seq2Seq Demand Forecasting API Documentation

This document outlines the technical specifications, deployment instructions, and endpoint reference for the Sequence-to-Sequence (Seq2Seq) Demand Forecasting model.

## 1. System & Environment Specifications
The API is built using a lightweight Flask web server, serving a TensorFlow-based LSTM architecture.

* **Python Version:** 3.12.10
* **Web Framework:** Flask 3.1.3
* **Machine Learning Backend:** TensorFlow 2.21.0
* **Data Processing:** Pandas 3.0.3, NumPy 2.4.6, Scikit-Learn 1.9.0
* **Production Server:** Waitress (Windows) / Gunicorn (Linux)

---

## 2. API Endpoint Reference

### `POST /predict`
This endpoint receives exactly 31 days of historical sales data for a single item and returns a 5-day forecasted demand schedule.

#### Request Parameters (JSON Body)
| Parameter | Data Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `last_date` | String | Yes | The final date of the provided historical data. Formatted as `YYYY-MM-DD`. Used to calculate the day of the week for future predictions. |
| `past_31_days_qty` | Array (Int) | Yes | An array containing exactly 31 integer values representing the daily sales volume for the preceding 31 days. |

#### Example Request Payload
```json
{
    "last_date": "2026-06-05",
    "past_31_days_qty": [15, 22, 18, 30, 25, 40, 35, 12, 19, 21, 28, 24, 38, 42, 15, 17, 20, 29, 26, 41, 39, 14, 18, 22, 31, 27, 45, 40, 16, 20, 25]
}
```

#### Response Structure
| Field | Data Type | Description |
| :--- | :--- | :--- |
| `status` | String | Indicates the success or failure of the request (e.g., "success"). |
| `forecast` | Array (Objects) | A list of objects containing the date and predicted quantity for the next 5 days (the horizon). |
| `forecast[].date` | String | The future calendar date for the prediction (`YYYY-MM-DD`). |
| `forecast[].predicted_qty` | Integer | The model's forecasted sales volume for that specific date (rounded and floored to avoid negative items). |

#### Example JSON Response
```json
{
    "status": "success",
    "forecast": [
        {"date": "2026-06-06", "predicted_qty": 24},
        {"date": "2026-06-07", "predicted_qty": 28},
        {"date": "2026-06-08", "predicted_qty": 21},
        {"date": "2026-06-09", "predicted_qty": 19},
        {"date": "2026-06-10", "predicted_qty": 22}
    ]
}
```

---

## 3. Deployment Instructions
**For Windows Environments (Waitress):**
```bash
waitress-serve --listen=0.0.0.0:5000 model_api:app
```

**For Linux/Mac/Docker Environments (Gunicorn):**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 model_api:app
```




