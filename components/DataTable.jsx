"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CaretSortIcon,
  DotsHorizontalIcon,
  MixerHorizontalIcon,
  PlusIcon,
  CaretUpIcon,
  CaretDownIcon,
} from "@radix-ui/react-icons";

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

import { Checkbox } from "@/components/ui/checkbox";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { toastSuccess, toastError, toastLoading } from "@/lib/toast";

function DataTable() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

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
      id: "CVR",
      header: "CVR",
      accessorKey: "cvr",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(row.getValue("CVR"));
                  toastSuccess("CVR kopieret til udklipsholder");
                }}
                className="cursor-pointer"
              >
                {row.getValue("CVR")}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Kopier til udklipsholder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
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
              <CaretUpIcon className="ml-1" />
            ) : column.getIsSorted() === "desc" ? (
              <CaretDownIcon className="ml-1" />
            ) : (
              <CaretSortIcon className="ml-1" />
            )}
          </Button>
        );
      },
      accessorKey: "navn",
      cell: ({ row }) => (
        <Link href={`/virksomhed/${row.getValue("CVR")}`}>
          {row.getValue("Navn")}
        </Link>
      ),
    },
    {
      id: "Telefonnr",
      header: "Telefon",
      accessorKey: "telefonnr",
      cell: ({ row }) => {
        const phoneNumber = row.getValue("Telefonnr");
        const formattedPhoneNumber = phoneNumber.replace(
          /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
          "$1 $2 $3 $4 $5"
        );
        return <a href={`tel:${phoneNumber}`}>{formattedPhoneNumber}</a>;
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
      id: "Hjemmeside",
      header: "Hjemmeside",
      accessorKey: "hjemmeside",
      cell: ({ row }) => {
        const website = row.getValue("Hjemmeside");
        const websiteWithoutHttps = website.replace("https://", "");
        return <Link href={website}>{websiteWithoutHttps}</Link>;
      },
    },
    {
      id: "Antal Ansatte",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Antal Ansatte
          {column.getIsSorted() === "asc" ? (
            <CaretUpIcon className="ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <CaretDownIcon className="ml-1" />
          ) : (
            <CaretSortIcon className="ml-1" />
          )}
        </Button>
      ),
      accessorKey: "antal_ansatte",
    },

    {
      id: "Personer",
      header: "Personer",
      accessorKey: "personer",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const virksomhed = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Åben Menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Handlinger</DropdownMenuLabel> */}
              <DropdownMenuItem>
                <Link href={`/virksomhed/${row.getValue("CVR")}`}>
                  Vis virksomhed
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(virksomhed.cvr);
                  toastSuccess("CVR kopiret til udklipsholder");
                }}
              >
                Kopier CVR
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    async function getData() {
      const { data, error } = await supabase.from("virksomheder").select("*");
      setData(data);
    }
    getData();
  }, []);

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

  return (
    <div className="w-full">
      <div className="flex justify-start my-4">
        <div className="flex gap-4">
          <Input
            placeholder="Filtrér virksomheder..."
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

          <Button className="ml-auto">
            <PlusIcon className="h-4 w-4 mr-2" />
            Tilføj virksomhed
          </Button>
        </div>
        <DropdownMenu closeOnSelect={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <MixerHorizontalIcon className="h-4 w-4 mr-2" />
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
            {/* Map through each header group */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* Map through each header within the group */}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {/* If the header is a placeholder, render nothing */}
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
            {/* If there are rows, map through each one */}
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {/* Map through each visible cell */}
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
      <div className="flex-1 text-sm text-muted-foreground mt-4">
        {table.getFilteredSelectedRowModel().rows.length} ud af{" "}
        {table.getFilteredRowModel().rows.length} række(r) valgt.
      </div>
    </div>
  );
}

export default DataTable;
