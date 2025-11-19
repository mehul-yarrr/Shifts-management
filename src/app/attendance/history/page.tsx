'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import Input from '../../components/Input';
import Button from '../../components/Button';
import type { Attendance } from '@/types/attendance';
import type { Employee } from '@/types/employee';

export default function AttendanceHistoryPage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.employeeId) params.append('employeeId', filters.employeeId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`/api/attendance/history?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e._id === employeeId);
    return employee?.name || employeeId;
  };

  const columns = [
    {
      header: 'Employee',
      accessor: (row: Attendance) => getEmployeeName(row.employeeId),
    },
    {
      header: 'Date',
      accessor: (row: Attendance) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: 'Check-in',
      accessor: (row: Attendance) => new Date(row.checkIn).toLocaleString(),
    },
    {
      header: 'Check-out',
      accessor: (row: Attendance) => row.checkOut ? new Date(row.checkOut).toLocaleString() : 'N/A',
    },
    {
      header: 'Status',
      accessor: (row: Attendance) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.status === 'present'
              ? 'bg-green-100 text-green-800'
              : row.status === 'late'
              ? 'bg-yellow-100 text-yellow-800'
              : row.status === 'absent'
              ? 'bg-red-100 text-red-800'
              : 'bg-orange-100 text-orange-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance History</h1>
          
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.employeeId}
                  onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                >
                  <option value="">All Employees</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />

              <Input
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                  <option value="early-leave">Early Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table
                data={attendance}
                columns={columns}
                emptyMessage="No attendance records found"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

