// app/super-admin/page.tsx

import React from 'react';

export default function SuperAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Super Admin Portal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">System Management</h2>
              <ul className="space-y-4">
                <li>
                  <button className="w-full bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition duration-300">
                    User Management
                  </button>
                </li>
                <li>
                  <button className="w-full bg-green-600 text-white rounded-md p-3 hover:bg-green-700 transition duration-300">
                    Lead Management
                  </button>
                </li>
                <li>
                  <button className="w-full bg-yellow-600 text-white rounded-md p-3 hover:bg-yellow-700 transition duration-300">
                    Realtor Management
                  </button>
                </li>
                <li>
                  <button className="w-full bg-red-600 text-white rounded-md p-3 hover:bg-red-700 transition duration-300">
                    System Configuration
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Total Users</h3>
                  <p className="text-4xl font-bold text-blue-600">1,234</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Active Leads</h3>
                  <p className="text-4xl font-bold text-green-600">567</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Conversion Rate</h3>
                  <p className="text-4xl font-bold text-yellow-600">12.5%</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Revenue This Month</h3>
                  <p className="text-4xl font-bold text-red-600">$98,765</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { user: 'John Doe', action: 'Created new lead', date: '2024-09-15' },
                  { user: 'Jane Smith', action: 'Updated user profile', date: '2024-09-14' },
                  { user: 'Mike Johnson', action: 'Assigned lead to realtor', date: '2024-09-13' },
                ].map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{activity.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{activity.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}