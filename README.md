# Mind Tapestry - Mental Health Assessment Web App

Mind Tapestry is a Flask-based web application designed to assess mental health risk levels based on user responses. It provides interactive animations and dynamic recommendations based on the assessment.

## 🚀 Features
- 🌐 Web-based questionnaire for mental health evaluation
- 📊 Dynamic risk level visualization using animated bars and gauge meters
- 🎯 Personalized recommendations based on the results
- 📄 PDF report generation of assessment results

## 📂 Project Structure
```
/mental-health-app
│-- /static
│   │-- style.css         # Styles for the web app
│   │-- script.js         # Form validation and navigation
│   │-- result.js         # Handles animations and report generation
│   │-- /images          # Contains logos and icons
│-- /templates
│   │-- index.html        # Main questionnaire page
│   │-- result.html       # Results page with risk levels
│-- app.py                # Flask backend (handles predictions)
│-- random_forest_model.pkl  # Trained ML model for prediction
│-- requirements.txt      # List of dependencies
│-- README.md             # Project documentation
```

## 🛠️ Installation & Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/mental-health-app.git
   cd mental-health-app
   ```

2. **Set Up a Virtual Environment (Recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate  # Windows
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```
   The app will be available at `http://127.0.0.1:5000`.

## 🌍 Deployment (Render)
1. Push your code to **GitHub**:
   ```bash
   git init
   git remote add origin https://github.com/yourusername/mental-health-app.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. Deploy to **Render**:
   - Sign up at [https://render.com/](https://render.com/).
   - Click "New Web Service" → "Connect Repository" → Select your GitHub repo.
   - Set the **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   - Set the **Start Command**:
     ```bash
     gunicorn app:app
     ```
   - Click **Deploy** and wait for the live URL.

## 🔗 Live Demo
https://mind-tapestry.onrender.com