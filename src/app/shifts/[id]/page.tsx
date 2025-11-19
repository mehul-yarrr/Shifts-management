'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import type { Shift } from '@/types/shift';
import type { Employee } from '@/types/employee';

export default function ShiftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [shift, setShift] = useState<Shift | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    startTime: '',
    endTime: '',
    date: '',
    location: '',
    notes: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [shiftRes, employeesRes] = await Promise.all([
        fetch(`/api/shifts/${id}`),
        fetch('/api/employees'),
      ]);

      if (shiftRes.ok) {
        const shiftData = await shiftRes.json();
        setShift(shiftData);
        const startDate = new Date(shiftData.startTime);
        const endDate = new Date(shiftData.endTime);
        setFormData({
          employeeId: shiftData.employeeId,
          startTime: startDate.toTimeString().slice(0, 5),
          endTime: endDate.toTimeString().slice(0, 5),
          date: new Date(shiftData.date).toISOString().split('T')[0],
          location: shiftData.location,
          notes: shiftData.notes || '',
          status: shiftData.status,
        });
      }

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData.filter((e: Employee) => e.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const startDateTime = `${formData.date}T${formData.startTime}`;
      const endDateTime = `${formData.date}T${formData.endTime}`;

      const response = await fetch(`/api/shifts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startTime: startDateTime,
          endTime: endDateTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update shift');
      }

      setShift(data);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this shift?')) {
      return;
    }

    try {
      const response = await fetch(`/api/shifts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete shift');
      }

      router.push('/shifts');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e._id === employeeId);
    return employee?.name || employeeId;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center">Shift not found</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Shift Details</h1>
            {!isEditing && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  >
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />

                <Input
                  label="Start Time"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />

                <Input
                  label="End Time"
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />

                <Input
                  label="Location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" isLoading={isSaving}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee</label>
                  <p className="mt-1 text-gray-900">{getEmployeeName(shift.employeeId)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="mt-1 text-gray-900">{new Date(shift.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Time</label>
                  <p className="mt-1 text-gray-900">{new Date(shift.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Time</label>
                  <p className="mt-1 text-gray-900">{new Date(shift.endTime).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-gray-900">{shift.location}</p>
                </div>
                {shift.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="mt-1 text-gray-900">{shift.notes}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        shift.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : shift.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {shift.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

