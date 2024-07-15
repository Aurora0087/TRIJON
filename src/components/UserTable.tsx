"use client";

import React from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IUser } from "@/database/models/user.model";
import { getUsers } from "@/database/action/user.action";

export const columns: ColumnDef<IUser>[] = [
    {
        accessorKey: "_id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "mobile",
        header: "Mobile",
    },
    {
        accessorKey: "joined",
        header: "Joined",
        cell: ({ row }) => new Date(row.original.joined).toLocaleDateString(),
    },
    {
        accessorKey: "signUpMethod",
        header: "Sign Up Method",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
];

function UserTable() {
    const [users, setUsers] = React.useState<IUser[]>([]);
    const [totalPages, setTotalPages] = React.useState(1);
    const [page, setPage] = React.useState(1);

    const fetchData = async (page: number) => {
        const data = await getUsers({ page });
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            fetchData(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            fetchData(page - 1);
        }
    };

    React.useEffect(() => {
        fetchData(page);
    }, [page]);

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="p-4 rounded-lg">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? null : (
                                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between py-2">
                <Button onClick={handlePreviousPage} disabled={page === 1}>
                    Previous
                </Button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <Button onClick={handleNextPage} disabled={page >= totalPages}>
                    Next
                </Button>
            </div>
        </div>
    );
}

export default UserTable;
