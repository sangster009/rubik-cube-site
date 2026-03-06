"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import type { WCACompetition } from "@/lib/wca";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns: ColumnDef<WCACompetition>[] = [
  {
    accessorKey: "short_name",
    header: "Competition",
    cell: ({ row }) => {
      const c = row.original;
      return (
        <Link
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:text-primary hover:underline"
        >
          {c.short_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("city")}</span>
    ),
  },
  {
    accessorKey: "start_date",
    header: "Date",
    cell: ({ row }) => {
      const c = row.original;
      const display =
        c.date_range ?? `${c.start_date} – ${c.end_date}`;
      return (
        <span className="text-muted-foreground whitespace-nowrap">
          {display}
        </span>
      );
    },
  },
];

interface CompetitionsTableProps {
  data: WCACompetition[];
}

export function CompetitionsTable({ data }: CompetitionsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border border-slate-200/80 dark:border-slate-700/50">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No upcoming Northern California competitions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
