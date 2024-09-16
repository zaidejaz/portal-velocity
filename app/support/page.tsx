// app/support/page.tsx

import React from 'react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Support Portal</h1>
          <div className="space-y-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">John Doe</h3>
                    <p className="text-sm text-gray-600">123 Main St, Anytown, USA 12345</p>
                    <p className="text-sm text-gray-600">johndoe@example.com | (123) 456-7890</p>
                    <p className="text-sm text-gray-600 mt-2">Property Value: $500,000</p>
                    <p className="text-sm text-gray-600">Sent: 2 times</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select className="border border-gray-300 rounded-md shadow-sm p-2">
                      <option>Select Realtor</option>
                      <option>Jane Smith</option>
                      <option>Mike Johnson</option>
                      <option>Sarah Brown</option>
                    </select>
                    <button className="bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-300">
                      Assign Lead
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}