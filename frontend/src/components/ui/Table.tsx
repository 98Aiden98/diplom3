import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface TableColumn<T> {
  title: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  emptyText?: string;
}

export function Table<T>({ data, columns, emptyText = 'Нет данных' }: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35),0_18px_34px_-26px_rgba(14,165,233,0.34)] ring-1 ring-sky-100/70 backdrop-blur">
      <div className="md:hidden">
        {data.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <div key={index} className="space-y-4 px-4 py-4">
                {columns.map((column) => (
                  <div key={column.title} className="space-y-1.5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {column.title}
                    </div>
                    <div className={clsx('text-sm text-slate-700', column.className)}>
                      {column.render(item)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center text-sm text-slate-500">{emptyText}</div>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/90">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.title}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="text-sm text-slate-700 transition hover:bg-sky-50/50">
                  {columns.map((column) => (
                    <td key={column.title} className={clsx('px-4 py-4 align-top', column.className)}>
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
