// app/realtor/page.tsx

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
  propertyValue: number;
  status: string;
}

export default function RealtorPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [realtorId, setRealtorId] = useState('realtor123'); // Replace with actual realtor ID

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/realtor?realtorId=${realtorId}`);
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

  const updateLeadStatus = async (leadId: string, status: string, comment: string) => {
    try {
      const response = await fetch('/api/realtor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, status, comment }),
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Realtor Portal</h1>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Available Leads</h2>
            <div className="space-y-6">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-gray-50 p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{lead.customerFirstName} {lead.customerLastName}</h3>
                      <p className="text-sm text-gray-600">{lead.propertyAddress}, {lead.city}, {lead.state} {lead.zipcode}</p>
                      <p className="text-sm text-gray-600">Property Value: ${lead.propertyValue.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <select
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value, '')}
                      >
                        <option value="CALLED">Called</option>
                        <option value="NOT_INTERESTED">Not Interested</option>
                        <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
                        <option value="LISTED">Listed</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Add comment"
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        onBlur={(e) => updateLeadStatus(lead.id, lead.status, e.target.value)}
                      />
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