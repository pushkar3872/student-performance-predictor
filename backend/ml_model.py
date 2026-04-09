import os

try:
    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline
    from sklearn.metrics import accuracy_score
    import joblib
except ImportError as e:
    raise ImportError(
        f"Missing required ML dependency: {e.name}. "
        "Please ensure you've installed all dependencies in your active virtual environment: "
        "python -m pip install pandas scikit-learn joblib python-multipart"
    ) from e

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "student_performance_model.joblib")

class StudentPerformanceModel:
    def __init__(self):
        # Create models directory if it doesn't exist
        os.makedirs(MODEL_DIR, exist_ok=True)
        self.model = None
        self._load_model_if_exists()

    def _load_model_if_exists(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
            except Exception as e:
                print(f"Error loading model: {e}")

    def train(self, csv_file_path: str):
        """
        Trains the logistic regression model using the provided CSV.
        """
        try:
            df = pd.read_csv(csv_file_path)
            
            # Basic validation
            required_columns = ['study_hours', 'attendance', 'previous_score', 'sleep_hours', 'result']
            for col in required_columns:
                if col not in df.columns:
                    raise ValueError(f"Missing required column: {col}")

            # Basic Preprocessing: Drop NaNs
            df = df.dropna()

            X = df[['study_hours', 'attendance', 'previous_score', 'sleep_hours']]
            y = df['result']

            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

            # Create a pipeline with standard scaler and logistic regression
            pipeline = Pipeline([
                ('scaler', StandardScaler()),
                ('classifier', LogisticRegression(random_state=42))
            ])

            pipeline.fit(X_train, y_train)

            # Evaluate
            predictions = pipeline.predict(X_test)
            accuracy = accuracy_score(y_test, predictions)

            # Save model
            self.model = pipeline
            joblib.dump(self.model, MODEL_PATH)

            return {
                "success": True,
                "accuracy": round(accuracy, 4),
                "message": "Model trained successfully."
            }

        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    def predict(self, study_hours: float, attendance: float, previous_score: float, sleep_hours: float):
        """
        Predicts if the student will pass (1) or fail (0).
        """
        if self.model is None:
            raise ValueError("Model is not trained yet. Please upload a dataset first.")

        # Create a dataframe for the input feature to avoid warning messages
        # from Scikit-Learn about missing feature names
        input_data = pd.DataFrame([{
            'study_hours': study_hours,
            'attendance': attendance,
            'previous_score': previous_score,
            'sleep_hours': sleep_hours
        }])

        prediction = self.model.predict(input_data)[0]
        probability = self.model.predict_proba(input_data)[0]

        return {
            "prediction": int(prediction),
            "result_text": "Pass" if prediction == 1 else "Fail",
            "probability": round(max(probability), 4)
        }

# Singleton instance
sp_model = StudentPerformanceModel()
