// app/qa/page.tsx

'use client'

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';

interface Lead {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipcode: string;
  status: string;
  recording?: string;
}

export default function QAPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/qa');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        throw new Error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      alert('Failed to fetch leads');
    }
  };

  const updateLeadStatus = async (leadId: string, status: string, recording: string) => {
    try {
      const response = await fetch('/api/qa', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, status, recording }),
      });

      if (response.ok) {
        alert('Lead status updated successfully');
        fetchLeads();
      } else {
        throw new Error('Failed to update lead status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">QA Portal</h1>
        <div className="space-y-8">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{lead.customerFirstName} {lead.customerLastName}</h3>
                  <p className="text-sm text-gray-600">{lead.propertyAddress}, {lead.city}, {lead.state} {lead.zipcode}</p>
                  <p className="text-sm text-gray-600">Current Status: {lead.status}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    className="border border-gray-300 rounded-md shadow-sm p-2"
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value, lead.recording || '')}
                  >
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="NO_COVERAGE">No Coverage</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter recording URL"
                  value={lead.recording || ''}
                  onChange={(e) => updateLeadStatus(lead.id, lead.status, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}