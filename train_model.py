# train_model.py
import pandas as pd
import numpy as np
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import r2_score, mean_absolute_error

# Load dataset
data = pd.read_csv("bangalore1.csv")

# Adjust price for inflation
inflation_rate = 0.04
years = 2025 - 2018
data["price_2025"] = data["price"] * (1 + inflation_rate) ** years

def clean_data(df):
    df["size"] = df["size"].fillna("2 BHK")
    df["location"] = df["location"].fillna("Unknown")
    df["bhk"] = df["size"].str.split().str[0].astype(int)

    def convert_sqft(x):
        try:
            if "-" in x:
                low, high = map(float, x.split("-"))
                return (low + high) / 2
            return float(x)
        except:
            return np.nan

    df["total_sqft"] = df["total_sqft"].apply(convert_sqft)
    df.dropna(subset=["total_sqft", "bath", "price_2025"], inplace=True)
    return df

data = clean_data(data.copy())



# One-hot encode location
encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
location_encoded = encoder.fit_transform(data[["location"]])
location_df = pd.DataFrame(location_encoded, columns=encoder.get_feature_names_out(["location"]))

# Add simulated binary feature columns (for API compatibility)
for col in ["parking", "garden", "swimmingPool", "gym", "security", "powerBackup"]:
    data[col] = np.random.randint(0, 2, size=len(data))  # simulate feature




data = data.reset_index(drop=True)
location_df = location_df.reset_index(drop=True)       #new-1


# Combine features
#X = pd.concat([
   # data[["total_sqft", "bath", "bhk", "parking", "garden", "swimmingPool", "gym", "security", "powerBackup"]],
  #  location_df
#], axis=1)                                                #//new-1

X = pd.concat([data[["total_sqft", "bath", "bhk"]], location_df], axis=1)         #new-1

y = data["price_2025"]



# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(f"R² Score: {r2_score(y_test, y_pred):.2f}")
print(f"MAE: ₹{mean_absolute_error(y_test, y_pred):.2f} lakhs")

# Save model and encoder
joblib.dump(model, "bangalore_home_prices_model.pkl")
joblib.dump(encoder, "location_encoder.pkl")
