// app/leadgen/page.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContex';
import toast from 'react-hot-toast';

interface Lead {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  phoneNumber: string;
  emailAddress: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipcode: string;
  homeOwner: boolean;
  propertyValue: number;
  contractWithRealtor: boolean;
  status: string;
  submissionDate: string;
}

export default function LeadGenPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const leadsPerPage = 100;
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    customerFirstName: '',
    customerLastName: '',
    phoneNumber: '',
    emailAddress: '',
    propertyAddress: '',
    city: '',
    state: '',
    zipcode: '',
    homeOwner: 'No',
    propertyValue: '',
    contractWithRealtor: 'No'
  });

  useEffect(() => {
    if (user && !showForm) {
      fetchLeads();
    }
  }, [user, showForm, currentPage, searchTerm]);

  const fetchLeads = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/leadgen?submittedById=${user.id}&page=${currentPage}&limit=${leadsPerPage}&search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
        setTotalPages(data.totalPages);
      } else {
        throw new Error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to submit a lead');
      return;
    }
    try {
      const leadId = generateLeadId(formData);
      const response = await fetch('/api/leadgen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: leadId,
          ...formData,
          homeOwner: formData.homeOwner === 'Yes',
          propertyValue: parseFloat(formData.propertyValue),
          contractWithRealtor: formData.contractWithRealtor === 'Yes',
          submittedById: user.id
        }),
      });

      if (response.ok) {
        toast.success('Lead submitted successfully');
        setFormData({
          customerFirstName: '',
          customerLastName: '',
          phoneNumber: '',
          emailAddress: '',
          propertyAddress: '',
          city: '',
          state: '',
          zipcode: '',
          homeOwner: 'No',
          propertyValue: '',
          contractWithRealtor: 'No'
        });
        fetchLeads();
      } else {
        throw new Error('Failed to submit lead');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error('Failed to submit lead');
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      customerFirstName: lead.customerFirstName,
      customerLastName: lead.customerLastName,
      phoneNumber: lead.phoneNumber,
      emailAddress: lead.emailAddress,
      propertyAddress: lead.propertyAddress,
      city: lead.city,
      state: lead.state,
      zipcode: lead.zipcode,
      homeOwner: lead.homeOwner ? 'Yes' : 'No',
      propertyValue: lead.propertyValue.toString(),
      contractWithRealtor: lead.contractWithRealtor ? 'Yes' : 'No'
    });
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingLead) return;
    try {
      const response = await fetch(`/api/leadgen/${editingLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          homeOwner: formData.homeOwner === 'Yes',
          propertyValue: parseFloat(formData.propertyValue),
          contractWithRealtor: formData.contractWithRealtor === 'Yes',
        }),
      });

      if (response.ok) {
        toast.success('Lead updated successfully');
        setEditingLead(null);
        setShowForm(false);
        fetchLeads();
      } else {
        throw new Error('Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || user.role !== 'SUPER_ADMIN') {
      toast.error('Only Super Admin can delete leads');
      return;
    }
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const response = await fetch(`/api/leadgen/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Lead deleted successfully');
          fetchLeads();
        } else {
          throw new Error('Failed to delete lead');
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const generateLeadId = (data: typeof formData) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const initials = (data.customerFirstName[0] + data.customerLastName[0]).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${day}-${initials}${randomNum}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Lead Generation Portal</h1>
      
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setShowForm(true)}
          className={`px-6 py-2 rounded-full ${showForm ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}
        >
          {editingLead ? 'Edit Lead' : 'Submit New Lead'}
        </button>
        <button
          onClick={() => {
            setShowForm(false);
            setEditingLead(null);
            fetchLeads();
          }}
          className={`px-6 py-2 rounded-full ${!showForm ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}
        >
          View Submitted Leads
        </button>
      </div>

      {showForm ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{editingLead ? 'Edit Lead' : 'Submit New Lead'}</h2>
          <form onSubmit={editingLead ? handleUpdate : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="customerFirstName"
                value={formData.customerFirstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="customerLastName"
                value={formData.customerLastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                placeholder="Property Address"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                placeholder="Zipcode"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="homeOwner"
                value={formData.homeOwner}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Yes">Home Owner: Yes</option>
                <option value="No">Home Owner: No</option>
              </select>
              <input
                type="number"
                name="propertyValue"
                value={formData.propertyValue}
                onChange={handleInputChange}
                placeholder="Property Value"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="contractWithRealtor"
                value={formData.contractWithRealtor}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Yes">Contract with Realtor: Yes</option>
                <option value="No">Contract with Realtor: No</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300">
              {editingLead ? 'Update Lead' : 'Submit Lead'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Submitted Leads</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.customerFirstName} {lead.customerLastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.phoneNumber}<br/>{lead.emailAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.propertyAddress}, {lead.city}, {lead.state} {lead.zipcode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Value: ${lead.propertyValue}<br/>
                      Home Owner: {lead.homeOwner ? 'Yes' : 'No'}<br/>
                      Realtor Contract: {lead.contractWithRealtor ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.submissionDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                        <button
                          onClick={() => handleEdit(lead)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Edit
                        </button>
                      )}
                      {user?.role === 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-red-600 hover:text-red-900"
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
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}