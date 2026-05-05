import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface Column<T> {
    header: string;
    key: keyof T | "index" | "actions";
    render?: (item: T, index: number) => React.ReactNode;
    sortable?: boolean; // false verirsen o kolon sıralanmaz (index, actions gibi)
    sortValue?: (item: T) => string | number; // render varsa ama sıralamak istiyorsan
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    maxHeight?: string;
    rowClassName?: (item: T, index: number) => string; // satır rengi için
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T extends object>({
    data,
    columns,
    maxHeight = "600px",
    rowClassName,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<Column<T>["key"] | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    const handleSort = (col: Column<T>) => {
        if (col.sortable === false) return;
        if (sortKey === col.key) {
            setSortDir((prev) =>
                prev === "asc" ? "desc" : prev === "desc" ? null : "asc",
            );
            if (sortDir === "desc") setSortKey(null);
        } else {
            setSortKey(col.key);
            setSortDir("asc");
        }
    };

    const sortedData = useMemo(() => {
        if (!sortKey || !sortDir) return data;

        const col = columns.find((c) => c.key === sortKey);
        return [...data].sort((a, b) => {
            let aVal: any;
            let bVal: any;

            if (col?.sortValue) {
                aVal = col.sortValue(a);
                bVal = col.sortValue(b);
            } else {
                aVal = a[sortKey as keyof T];
                bVal = b[sortKey as keyof T];
            }

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }

            return sortDir === "asc"
                ? String(aVal).localeCompare(String(bVal), "tr")
                : String(bVal).localeCompare(String(aVal), "tr");
        });
    }, [data, sortKey, sortDir, columns]);

    const SortIcon = ({ col }: { col: Column<T> }) => {
        if (col.sortable === false) return null;
        if (sortKey !== col.key)
            return <ChevronsUpDown size={14} className="opacity-40" />;
        if (sortDir === "asc") return <ChevronUp size={14} />;
        if (sortDir === "desc") return <ChevronDown size={14} />;
        return <ChevronsUpDown size={14} className="opacity-40" />;
    };

    return (
        <div className="w-full flex flex-col border border-slate-700 rounded-lg overflow-hidden bg-white shadow-xl">
            <div className="overflow-auto" style={{ maxHeight }}>
                <table className="w-full text-sm text-slate-300">
                    <colgroup>
                        {columns.map((col, idx) => {
                            // Sabit genişlik istediğin kolonlar için buraya ekle
                            const fixedWidths: Partial<Record<string, string>> =
                                {
                                    index: "3%",
                                    actions: "10%",
                                };
                            const w = fixedWidths[col.key as string];
                            return (
                                <col
                                    key={idx}
                                    style={w ? { width: w } : undefined}
                                />
                            );
                        })}
                    </colgroup>

                    <thead className="sticky top-0 z-10 bg-slate-800 select-text cursor-text text-slate-300">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    onClick={() => handleSort(col)}
                                    className={`px-3 py-3 border-b border-slate-700 text-center select-none
                    ${col.sortable !== false ? "cursor-pointer hover:bg-slate-700 transition-colors" : ""}`}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <span>{col.header}</span>
                                        <SortIcon col={col} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                        {sortedData.length > 0 ? (
                            sortedData.map((item, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`hover:brightness-95 transition-colors font-bold text-slate-900
                    ${rowClassName ? rowClassName(item, rowIndex) : "hover:bg-slate-100"}`}
                                >
                                    {columns.map((col, colIdx) => {
                                        const isLongText = [
                                            "AnimalNote",
                                            "Name",
                                            "BullName",
                                            "Note",
                                        ].includes(col.key as string);
                                        const isShort =
                                            col.key === "index" ||
                                            col.key === "EarringNo" ||
                                            col.key === "MotherEarringNo";
                                        return (
                                            <td
                                                key={colIdx}
                                                className={`px-3 py-3 text-center align-middle
                      ${
                          isLongText
                              ? "whitespace-normal wrap-break-word"
                              : isShort
                                ? "whitespace-nowrap w-px" // içeriğe göre küçül, kesme
                                : "whitespace-nowrap overflow-hidden text-ellipsis"
                      }`}
                                            >
                                                {col.render
                                                    ? col.render(item, rowIndex)
                                                    : (item[
                                                          col.key as keyof T
                                                      ] as React.ReactNode)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-10 text-slate-500"
                                >
                                    Veri bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
