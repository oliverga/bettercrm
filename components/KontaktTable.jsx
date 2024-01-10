"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// shadcn components import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

// tanstack table import
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { toast } from "sonner";
import {
  IconCaretDown,
  IconCaretUp,
  IconCaretUpDown,
  IconColumns,
  IconDots,
} from "@tabler/icons-react";

import parsePhoneNumber from "libphonenumber-js";
import ManageKontakt from "./ManageKontakt";

function DataTable({ session, params }) {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [relationer, setRelationer] = useState([]);
  const [virksomheder, setVirksomheder] = useState([]);

  const supabase = createClientComponentClient();

  // // Save column visibility to local storage
  // useEffect(() => {
  //   localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  // }, [columnVisibility]);

  // define table columns
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "Navn",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Navn
            {column.getIsSorted() === "asc" ? (
              <IconCaretUp className="h-4 w-4 ml-1" />
            ) : column.getIsSorted() === "desc" ? (
              <IconCaretDown className="h-4 w-4 ml-1" />
            ) : (
              <IconCaretUpDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        );
      },
      accessorKey: "navn",
      cell: ({ row }) => (
        <Link href={`/kontakt/${row.original.id}`}>{row.getValue("Navn")}</Link>
      ),
    },
    // {
    //   id: "Titel",
    //   header: "Titel",
    //   accessorKey: "titel",
    //   cell: ({ row }) => {
    //     const virksomhedId = params.id;
    //     const relation = row.original.virksomhed_relationer.find(
    //       (relation) => relation.virksomhed === virksomhedId
    //     );
    //     return relation ? relation.titel : null;
    //   },
    // },
    {
      id: "Telefon",
      header: "Telefon",
      accessorKey: "telefonnr",
      cell: ({ row }) => {
        if (!row.getValue("Telefon")) {
          return null;
        }
        const phoneNumber = parsePhoneNumber(row.getValue("Telefon"));
        if (!phoneNumber) {
          return null;
        }
        return (
          <a href={phoneNumber.getURI()}>{phoneNumber.formatInternational()}</a>
        );
      },
    },
    {
      id: "Email",
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => (
        <Link href={`mailto:${row.getValue("Email")}`} className="lowercase">
          {row.getValue("Email")}
        </Link>
      ),
    },
    {
      id: "Relationer",
      header: "Relationer",
      accessorKey: "relationer",
      cell: ({ row }) => {
        const kontakt = row.original;
        const relations = relationer.filter(
          (relation) => relation.kontakt_from === kontakt.id
        );
        console.log(relations);
        return relations.length > 0 ? (
          <ul className="space-y-1">
            {relations.slice(0, 2).map((relation, index) => (
              <li key={index}>
                <span className=" text-muted-foreground">{`${relation.relation} hos `}</span>
                {virksomheder.find((v) => v.id === relation.virksomhed_to) ? (
                  <Link
                    href={`/virksomhed/${relation.virksomhed_to}`}
                    className=""
                  >
                    {
                      virksomheder.find((v) => v.id === relation.virksomhed_to)
                        .navn
                    }
                  </Link>
                ) : (
                  relation.virksomhed_to
                )}
              </li>
            ))}
            {relations.length > 3 && (
              <li>
                <span className=" text-muted-foreground text-xs">{`+${
                  relations.length - 2
                } ${
                  relations.length - 2 > 1 ? "relationer" : "relation"
                }`}</span>
              </li>
            )}
          </ul>
        ) : null;
      },
    },
    {
      id: "Dato Tilføjet",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Dato Tilføjet
            {column.getIsSorted() === "asc" ? (
              <IconCaretUp className="h-4 w-4 ml-1" />
            ) : column.getIsSorted() === "desc" ? (
              <IconCaretDown className="h-4 w-4 ml-1" />
            ) : (
              <IconCaretUpDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        );
      },
      accessorKey: "created_at",
      cell: ({ row }) => {
        const date = row.getValue("Dato Tilføjet");
        return date ? new Date(date).toLocaleDateString() : null;
      },
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const kontakt = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Åben Menu</span>
                <IconDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Handlinger</DropdownMenuLabel> */}
              <Link href={`/kontakt/${kontakt.id}`}>
                <DropdownMenuItem>Vis</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  const { error } = await supabase
                    .from("kontakter") // Replace with your table name
                    .delete()
                    .eq("id", kontakt.id);

                  if (error) {
                    console.error("Error deleting row:", error);
                  } else {
                    toast("Kontakt slettet");
                    fetchKontakter();
                  }
                }}
              >
                Slet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchKontakter = async () => {
    const { data, error } = await supabase
      .from("kontakter")
      .select("*")
      .order("created_at", { ascending: false });
    setData(data);
  };

  const fetchRelationer = async () => {
    const { data, error } = await supabase.from("relationer").select("*");
    setRelationer(data);
  };

  const fetchVirksomheder = async () => {
    const { data, error } = await supabase.from("virksomheder").select("*");
    setVirksomheder(data);
  };

  useEffect(() => {
    fetchRelationer();
  }, []);

  useEffect(() => {
    fetchKontakter();
  }, []);

  useEffect(() => {
    fetchVirksomheder();
  }, []);

  // Define table
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Render dashboard
  return (
    <div className="w-full">
      <div className="flex justify-start mt-12 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Søg i kontakter..."
            value={
              table.getColumn("Navn")
                ? table.getColumn("Navn").getFilterValue()
                : ""
            }
            onChange={(event) =>
              table.getColumn("Navn")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <ManageKontakt
            session={session}
            mode="add"
            refreshData={() => {
              fetchKontakter();
            }}
            table={table}
          />
        </div>

        <DropdownMenu closeOnSelect={false} clas>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <IconColumns className="h-4 w-4 mr-2" />
              Vis
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" data-state="open">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
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
              // If there are no rows, display a message
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Ingen resultater.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end mt-4 items-center">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Forrige
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Næste
          </Button>
        </div>
      </div>

      {/* <RowManipulation
        show={table.getFilteredSelectedRowModel().rows.length > 0}
        table={table}
        setRowSelection={setRowSelection}
      /> */}
    </div>
  );
}

export default DataTable;
