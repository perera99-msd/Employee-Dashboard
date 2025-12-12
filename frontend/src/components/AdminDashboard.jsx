import React, { useState, useEffect } from 'react';
import axios from 'axios';

const departments = [
    'All Departments',
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations'
];

const AdminDashboard = () => {
    const [feedbackData, setFeedbackData] = useState({
        data: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        }
    });
    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch data when filters change
    useEffect(() => {
        setCurrentPage(1);
        fetchFeedback();
    }, [selectedDept, debouncedSearchTerm]);

    // Fetch data when page changes
    useEffect(() => {
        fetchFeedback();
    }, [currentPage]);

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...(selectedDept !== 'All Departments' && { department: selectedDept }),
                ...(debouncedSearchTerm && { search: debouncedSearchTerm })
            });

            const response = await axios.get(`http://localhost:5000/feedback?${params}`, {
                withCredentials: true
            });
            
            setFeedbackData(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= feedbackData.pagination.totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        const { page, totalPages } = feedbackData.pagination;
        
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
        );

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                        i === page
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        );

        return pages;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Feedback Dashboard</h2>
                        <p className="text-slate-500 mt-1">Manage and review employee feedback</p>
                    </div>
                    
                    {/* Stats Card */}
                    <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Total Records</p>
                            <p className="text-lg font-bold text-slate-800">{feedbackData.pagination.total}</p>
                        </div>
                    </div>
                </div>
                
                {/* Controls Area */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name, message, or department..."
                                    className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-shadow"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <svg className="h-4 w-4 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Filter by Department
                            </label>
                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="w-full md:w-48 px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-shadow cursor-pointer"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Main Table Content */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-slate-500">Loading feedback...</p>
                        </div>
                    ) : feedbackData.data.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No feedback found</h3>
                            <p className="mt-1 text-slate-500 mb-4">
                                {searchTerm || selectedDept !== 'All Departments' 
                                    ? 'Try adjusting your search or filter criteria.' 
                                    : 'No feedback has been submitted yet.'}
                            </p>
                            {(searchTerm || selectedDept !== 'All Departments') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedDept('All Departments');
                                    }}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                                            <th className="px-4 md:px 6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</th>
                                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {feedbackData.data.map((feedback, index) => (
                                            <tr key={feedback.id || index} className="hover:bg-slate-50 transition-colors duration-150">
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                            {getInitials(feedback.name)}
                                                        </div>
                                                        <div className="ml-3 md:ml-4">
                                                            <div className="text-sm font-medium text-slate-900">{feedback.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        {feedback.department}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-6 py-4">
                                                    <div className="text-sm text-slate-600 max-w-xs md:max-w-md break-words leading-relaxed line-clamp-2">
                                                        {feedback.message}
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                                                    {formatDate(feedback.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {feedbackData.pagination.totalPages > 0 && (
                                <div className="bg-slate-50 px-4 md:px-6 py-4 border-t border-slate-200">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-slate-600">
                                            Showing{' '}
                                            <span className="font-semibold">
                                                {Math.min((feedbackData.pagination.page - 1) * feedbackData.pagination.limit + 1, feedbackData.pagination.total)}
                                            </span>{' '}
                                            to{' '}
                                            <span className="font-semibold">
                                                {Math.min(feedbackData.pagination.page * feedbackData.pagination.limit, feedbackData.pagination.total)}
                                            </span>{' '}
                                            of{' '}
                                            <span className="font-semibold">{feedbackData.pagination.total}</span>{' '}
                                            results
                                        </div>
                                        
                                        <div className="flex items-center space-x-1">
                                            {renderPagination()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;