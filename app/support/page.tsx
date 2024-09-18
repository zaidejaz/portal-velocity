// app/support/page.tsx

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
  leadAssignments: { id: string }[];
}

interface Realtor {
  id: string;
  firstName: string;
  lastName: string;
}

export default function SupportPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [realtors, setRealtors] = useState<Realtor[]>([]);

  useEffect(() => {
    fetchAcceptedLeads();
    fetchRealtors();
  }, []);

  const fetchAcceptedLeads = async () => {
    try {
      const response = await fetch('/api/support');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        throw new Error('Failed to fetch accepted leads');
      }
    } catch (error) {
      console.error('Error fetching accepted leads:', error);
      alert('Failed to fetch accepted leads');
    }
  };

  const fetchRealtors = async () => {
    try {
      const response = await fetch('/api/support/realtors');
      if (response.ok) {
        const data = await response.json();
        setRealtors(data);
      } else {
        throw new Error('Failed to fetch realtors');
      }
    } catch (error) {
      console.error('Error fetching realtors:', error);
      alert('Failed to fetch realtors');
    }
  };

  const assignLead = async (leadId: string, realtorId: string) => {
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, realtorId }),
      });

      if (response.ok) {
        alert('Lead assigned successfully');
        fetchAcceptedLeads();
      } else {
        throw new Error('Failed to assign lead');
      }
    } catch (error) {
      console.error('Error assigning lead:', error);
      alert('Failed to assign lead');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Support Portal</h1>
        <div className="space-y-8">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{lead.customerFirstName} {lead.customerLastName}</h3>
                  <p className="text-sm text-gray-600">{lead.propertyAddress}, {lead.city}, {lead.state} {lead.zipcode}</p>
                  <p className="text-sm text-gray-600">Property Value: ${lead.propertyValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Sent: {lead.leadAssignments.length} time(s)</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    className="border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={(e) => assignLead(lead.id, e.target.value)}
                  >
                    <option value="">Select Realtor</option>
                    {realtors.map((realtor) => (
                      <option key={realtor.id} value={realtor.id}>
                        {realtor.firstName} {realtor.lastName}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-300"
                    onClick={() => assignLead(lead.id, '')}
                  >
                    Assign Lead
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}