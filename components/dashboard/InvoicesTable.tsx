'use client'

import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button' // ShadCN button (or replace with a normal button)

type Invoice = {
  id: number
  customer: string
  amount: string
  date: string
}

const data: Invoice[] = [
  { id: 1, customer: 'Alice', amount: '$100', date: '2024-01-01' },
  { id: 2, customer: 'Bob', amount: '$200', date: '2024-01-05' },
  { id: 3, customer: 'Charlie', amount: '$300', date: '2024-02-01' },
]

export default function InvoicesTable() {
  const [expandedRows, setExpandedRows] = React.useState<{ [key: number]: boolean }>({})

  const toggleRow = (rowId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }))
  }

  const columns: ColumnDef<Invoice>[] = [
    {
      header: 'Customer',
      accessorKey: 'customer',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
    },
    {
      header: 'Date',
      accessorKey: 'date',
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <Button variant="outline" onClick={() => toggleRow(row.original.id)}>
          {expandedRows[row.original.id] ? 'Hide Details' : 'Show Details'}
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left p-3 text-sm font-semibold">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {expandedRows[row.original.id] && (
                <tr className="bg-gray-50">
                  <td colSpan={row.getVisibleCells().length} className="p-4">
                    <div className="text-sm text-gray-700">
                      <strong>Details:</strong> This invoice was created on {row.original.date} for {row.original.amount} charged to {row.original.customer}.
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
