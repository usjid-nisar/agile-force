# Article Management System

A modern, full-stack application for managing articles with AI-powered features. Built with React, TypeScript, and FastAPI.

## 🚀 Features

- Create, read, update, and delete articles
- AI-powered article summarization
- Article embedding generation for semantic search
- Real-time updates with Redux Toolkit
- Modern, responsive UI with Tailwind CSS
- MongoDB database integration

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Redux Toolkit
- Tailwind CSS
- HeadlessUI
- React Hot Toast

### Backend
- FastAPI
- MongoDB (with Motor)
- Python 3.x
- Pydantic

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (latest LTS version)
- Python 3.x
- MongoDB instance
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd article-management-system
```

2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`

3. Backend Setup:
```bash
cd backend
pip install -r requirements.txt

# Create a .env file with your MongoDB connection string:
echo "MONGODB_URL=your_mongodb_connection_string" > .env

# Start the backend server
uvicorn app.main:app --reload
```
The backend API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for the interactive API documentation.

### Available Endpoints:
- `GET /articles` - List all articles
- `POST /articles` - Create a new article
- `GET /articles/{id}` - Get a specific article
- `PUT /articles/{id}` - Update an article
- `DELETE /articles/{id}` - Delete an article
- `POST /articles/{id}/summarize` - Generate AI summary
- `POST /articles/{id}/embed` - Create article embedding

## 🎨 Features & Screenshots

[You can add screenshots of your application here]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [HeadlessUI](https://headlessui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
