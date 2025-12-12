import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/check', {
                withCredentials: true
            });
            
            if (response.data.isAuthenticated) {
                setIsAuthenticated(true);
                setUser(response.data.user);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        } catch (error) {
            console.log('Auth check failed:', error.message);
            setIsAuthenticated(false);
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-slate-50">
                {isAuthenticated && (
                    <nav className="bg-white shadow-lg border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3">
                                                <span className="text-white font-bold text-sm">FD</span>
                                            </div>
                                            <span className="text-xl font-bold text-slate-800">Feedback Dashboard</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        <span>Admin</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-150"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                )}

                {!isAuthenticated && (
                    <nav className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3">
                                        <span className="text-white font-bold text-sm">FD</span>
                                    </div>
                                    <span className="text-lg font-semibold text-slate-800">Employee Feedback</span>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <Link 
                                        to="/" 
                                        className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                                    >
                                        Feedback Form
                                    </Link>
                                    <Link 
                                        to="/login" 
                                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 shadow-sm hover:shadow"
                                    >
                                        Admin Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>
                )}
                
                <Routes>
                    <Route path="/" element={<FeedbackForm />} />
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate to="/admin" /> : <Login setIsAuthenticated={setIsAuthenticated} />
                    } />
                    <Route path="/admin" element={
                        isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;