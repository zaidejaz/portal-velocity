// app/admin/page.tsx

'use client'

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Lead {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  status: string;
}

interface Realtor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [realtors, setRealtors] = useState<Realtor[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    fetchData('users');
    fetchData('leads');
    fetchData('realtors');
    // In a real application, you would determine the user's role here
    setIsSuperAdmin(true);
  }, []);

  const fetchData = async (model: string) => {
    try {
      const response = await fetch(`/api/admin?model=${model}`);
      if (response.ok) {
        const data = await response.json();
        switch (model) {
          case 'users':
            setUsers(data);
            break;
          case 'leads':
            setLeads(data);
            break;
          case 'realtors':
            setRealtors(data);
            break;
        }
      } else {
        throw new Error(`Failed to fetch ${model}`);
      }
    } catch (error) {
      console.error(`Error fetching ${model}:`, error);
      alert(`Failed to fetch ${model}`);
    }
  };

  const handleDelete = async (model: string, id: string) => {
    if (!isSuperAdmin) {
      alert('Only Super Admin can delete records');
      return;
    }

    try {
      const response = await fetch(`/api/admin?model=${model}&id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert(`${model.slice(0, -1)} deleted successfully`);
        fetchData(model);
      } else {
        throw new Error(`Failed to delete ${model.slice(0, -1)}`);
      }
    } catch (error) {
      console.error(`Error deleting ${model.slice(0, -1)}:`, error);
      alert(`Failed to delete ${model.slice(0, -1)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{isSuperAdmin ? 'Super Admin' : 'Admin'} Portal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">User Management</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                        {isSuperAdmin && (
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete('users', user.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Lead Management</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{lead.customerFirstName} {lead.customerLastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{lead.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                        {isSuperAdmin && (
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete('leads', lead.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Realtor Management</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {realtors.map((realtor) => (
                  <tr key={realtor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{realtor.firstName} {realtor.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{realtor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                      {isSuperAdmin && (
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete('realtors', realtor.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
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