from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from ml_model import sp_model

app = FastAPI(title="Student Performance Predictor API")

# Allow all origins for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentData(BaseModel):
    study_hours: float
    attendance: float
    previous_score: float
    sleep_hours: float

@app.get("/")
def read_root():
    return {"message": "Welcome to the Student Performance Predictor API"}

@app.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    # Save the file temporarily
    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Train model
        result = sp_model.train(temp_file_path)
        
        if result['success']:
            return {"message": result['message'], "accuracy": result['accuracy']}
        else:
            raise HTTPException(status_code=400, detail=result['message'])
    finally:
        # Cleanup
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.post("/predict")
def predict_performance(data: StudentData):
    try:
        result = sp_model.predict(
            study_hours=data.study_hours,
            attendance=data.attendance,
            previous_score=data.previous_score,
            sleep_hours=data.sleep_hours
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
