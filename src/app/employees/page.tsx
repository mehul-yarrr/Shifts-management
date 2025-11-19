'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Table from '../components/Table';
import type { Employee } from '@/types/employee';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
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
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Employee },
    { header: 'Email', accessor: 'email' as keyof Employee },
    { header: 'Phone', accessor: 'phone' as keyof Employee },
    { header: 'Position', accessor: 'position' as keyof Employee },
    { header: 'Department', accessor: 'department' as keyof Employee },
    {
      header: 'Status',
      accessor: (row: Employee) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <Link href="/employees/add">
              <Button>Add Employee</Button>
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg">
            <Table
              data={employees}
              columns={columns}
              onRowClick={(row) => router.push(`/employees/${row._id}`)}
              emptyMessage="No employees found"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

