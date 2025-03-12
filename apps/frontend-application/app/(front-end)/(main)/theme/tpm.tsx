import React from 'react';

const TestThemePage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Theme Mode Test</h1>

            {/* Buttons */}
            <div className="space-x-4 mb-6">
                <button className="px-4 py-2 font-semibold text-white bg-blue-500 rounded dark:bg-blue-700">
                    Primary Button
                </button>
                <button className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-100">
                    Secondary Button
                </button>
            </div>

            {/* Input Field */}
            <div className="mb-6">
                <label className="block font-medium mb-2">Input Field</label>
                <input
                    type="text"
                    placeholder="Type here..."
                    className="w-full px-4 py-2 border rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                />
            </div>

            {/* Card */}
            <div className="p-6 mb-6 bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="text-2xl font-semibold mb-4">Card Title</h2>
                <p className="text-gray-700 dark:text-gray-300">
                    This is a sample card to test the theme mode.
                </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center space-x-2">
                <label className="font-medium">Dark Mode Toggle</label>
                <input type="checkbox" className="toggle-checkbox" />
                <span className="block w-12 h-6 bg-gray-300 rounded-full shadow-inner dark:bg-gray-600 relative">
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform dark:translate-x-6"></span>
                </span>
            </div>
        </div>
    );
};

export default TestThemePage;
