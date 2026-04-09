# Student Performance Predictor

A full-stack, deployable machine learning web application predicting student performance (Pass/Fail) based on study hours, attendance, previous scores, and sleep hours.

## Architecture

- **Backend**: Python, FastAPI, Scikit-Learn
- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (Modern Glassmorphism theme)

## Local Development Setup

### 1. Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   *The API will be available at http://localhost:8000*

### 2. Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open in your browser (usually http://localhost:5173).*

### 3. Usage & Testing

- Use the included `sample_students.csv` located in the root directory to train the model via the UI.
- Input student characteristics into the Prediction form to retrieve a Pass/Fail outcome!

## Deployment Instructions

### Backend (Render / Railway)
1. Push this repository to GitHub.
2. In Render or Railway, create a new "Web Service".
3. Use the `backend` folder as the root directory.
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Set the Framework Preset to `Vite`.
3. Vercel should automatically detect `npm run build` and `dist` as the output directory.
4. Ensure you set the `API_BASE_URL` environment variable properly if you update the fetch strings in the React components, pointing to your deployed Backend URL.
