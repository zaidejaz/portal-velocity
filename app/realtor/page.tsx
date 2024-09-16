// app/realtor/page.tsx

import React from 'react';
import Header from '../../components/Header';

export default function RealtorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Realtor Portal</h1>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Available Leads</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">John Doe</h3>
                      <p className="text-sm text-gray-600">123 Main St, Anytown, USA 12345</p>
                      <p className="text-sm text-gray-600">Property Value: $500,000</p>
                      <p className="text-sm text-gray-600">Bedrooms: 3 | Bathrooms: 2</p>
                    </div>
                    <div className="space-y-2">
                      <select className="block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option>Update Status</option>
                        <option>Called</option>
                        <option>Not Interested</option>
                        <option>Meeting Scheduled</option>
                        <option>Listed</option>
                      </select>
                      <input type="text" placeholder="Add comment" className="block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                      <button className="w-full bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-300">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}