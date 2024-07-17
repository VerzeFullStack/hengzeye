import "./UserInventory.css";
import { Fragment, useState, useMemo, useRef, useEffect } from "react";
import {
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
  SortingState,
} from "@tanstack/react-table";
import ReactModal from "react-modal";
import { ListingProduct } from "../../dataModels/ListingProduct";
import { getListingProducts } from "../../api/GetFakeData";
import { ListProductForm } from "./ListProductForm";
import { useAppSelector } from "../../app/hooks";
import { selectAccessToken, selectClaims } from "../../features/user/userSlice";

ReactModal.setAppElement("#root");

function UserInventory() {
  const claims = useAppSelector(selectClaims);
  const accessToken = useAppSelector(selectAccessToken);

  const columns = useMemo<ColumnDef<ListingProduct>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => "Product Name",
        //enableSorting: false
      },
      {
        accessorKey: "category",
        header: () => "Category",
        //enableSorting: false
      },
      {
        accessorKey: "quantity",
        header: () => "Quantity",
        //enableSorting: false
      },
    ],
    []
  );
  const [data] = useState(() => getListingProducts(10000));

  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    state: {
      sorting,
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");

  function openModal(productName: string) {
    setSelectedProductName(productName);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    if (subtitleRef.current) {
      subtitleRef.current.style.color = "#000";
    }
  }

  function closeModal() {
    setSelectedProductName("");
    setIsOpen(false);
  }

  useEffect(() => {
    if (modalIsOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [modalIsOpen]);

  return (
    <div className="main">
      <>
        <p>Account Balance: 100000</p>
        <p>Claims: {JSON.stringify(claims)}</p>
        <p>Access Token: {accessToken}</p>
      </>
      <ReactModal
        className="modalContent"
        overlayClassName="modalOverlay"
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        shouldFocusAfterRender={false}
        contentLabel="Example Modal"
      >
        <h1 style={{ height: "10%" }}>List Your Product</h1>
        <p
          style={{
            height: "5%",
            paddingLeft: "10%",
            display: "flex",
          }}
          ref={subtitleRef}
        >
          Product Name: {selectedProductName}
        </p>
        <ListProductForm closeModal={closeModal} />
      </ReactModal>
      {accessToken ? (
        <>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id}>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Fragment key={row.id}>
                    <tr
                      className="cursor-pointer"
                      onClick={() => openModal(row.original.name)}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center">
            <button
              className="border rounded p-1"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
            {table.getRowCount().toLocaleString()} Rows
          </div>
          <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
        </>
      ) : (
        <>
          <h1>Please login first.</h1>
        </>
      )}
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      className="w-36 border shadow rounded"
      onChange={(e) => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}

export default UserInventory;
