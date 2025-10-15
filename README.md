🎥 Overlay Management Backend
This project is an HLS video player featuring dynamic text and logo overlays that can be added, edited, moved, resized, or deleted in real-time. Ideal for livestream branding, captions, or announcements, it’s built with Flask and MongoDB Atlas, providing full CRUD support for managing overlays seamlessly during playback.

---

## 🚀 Tech Stack
- **Frontend**: React.js, HLS.js, React-RND (draggable/resizable overlays)
- **Backend**: Python Flask + MongoDB Atlas
- **Styling**: CSS (custom + responsive)

---

### 📂 Project structure
```bash
 ┣ 📂 backend        # Flask + MongoDB API
 ┃ ┣ app.py
 ┃ ┣ requirements.txt
 ┣ 📂 frontend       # React HLS Player + Overlay Form
 ┃ ┣ src/
 ┃ ┣ package.json
 ┣ README.md         # Setup + Docs
```
---

## 🚀 Setup Backend

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/Livestream-RTSP-URL.git
cd backend
```
### 2️⃣ Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate   # for Mac/Linux
venv\Scripts\activate      # for Windows
```
### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```
### 4️⃣ Configure MongoDB Connection(Add MongoDB Atlas)
```bash
client = MongoClient("mongodb+srv://<username>:<password>@cluster-url")
```
### 5️⃣ Run the Server
```bash
python app.py
```

Server will run on:
```bash
👉 http://127.0.0.1:5000/
```
---

## 🚀 Setup Frontend(React)
```bash
cd frontend
npm install
npm start
```

## 📌 API Documentation
# 🎯 Base URL
```bash
http://127.0.0.1:5000
