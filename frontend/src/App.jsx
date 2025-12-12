import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center h-16">
                            <div className="text-xl font-bold text-gray-800">
                                Employee Feedback Dashboard
                            </div>
                            <div className="space-x-4">
                                <Link 
                                    to="/" 
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Feedback Form
                                </Link>
                                <Link 
                                    to="/admin" 
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Admin Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <Routes>
                    <Route path="/" element={<FeedbackForm />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;