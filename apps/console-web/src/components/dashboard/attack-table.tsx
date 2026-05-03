"use client";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

export type AttackRow = { ts: string; type: string; severity: string; route: string };
const c = createColumnHelper<AttackRow>();
const columns = [c.accessor("ts", { header: "Time" }), c.accessor("type", { header: "Type" }), c.accessor("severity", { header: "Severity" }), c.accessor("route", { header: "Route" })];

export function AttackTable({ data }: { data: AttackRow[] }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  return <table className="w-full text-sm"><thead>{table.getHeaderGroups().map(hg => <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} className="p-2 text-left">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map(r => <tr key={r.id}>{r.getVisibleCells().map(cell => <td key={cell.id} className="p-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table>;
}
