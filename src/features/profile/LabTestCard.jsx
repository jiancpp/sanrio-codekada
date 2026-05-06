import { useState } from 'react';
import { formatDate } from '../../hooks/utils'; // Adjust path based on your setup

export default function LabTestCard({ test }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-olive-light rounded-2xl overflow-hidden mb-3">
      {/* Header Row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-egg transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-base">🧪</span>
          <div>
            <p className="font-bold text-sm">{test.testName ?? 'Lab Test'}</p>
            <p className="text-[11px] text-gray-400">{formatDate(test.testDate)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {test.items?.length > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-egg border border-olive-light px-2 py-0.5 rounded-full">
              {test.items.length} item{test.items.length !== 1 ? 's' : ''}
            </span>
          )}
          <span className={`text-lg transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
            ›
          </span>
        </div>
      </button>

      {/* Expandable Content */}
      {open && (
        <div className="px-5 pb-5 border-t border-olive-light animate-in fade-in duration-300">
          {test.findingsSummary && (
            <div className="bg-egg rounded-xl px-4 py-3 mt-4 mb-4 border border-olive-light">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Findings</p>
              <p className="text-sm leading-relaxed">{test.findingsSummary}</p>
            </div>
          )}

          {test.items?.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-olive-light">
                    <th className="text-left py-2 pr-4">Test Item</th>
                    <th className="text-right py-2 px-2">Result</th>
                    <th className="text-right py-2 px-2">Unit</th>
                    <th className="text-right py-2 pl-2">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {test.items.map((item, j) => (
                    <tr key={j} className="border-b border-olive-light last:border-0">
                      <td className="py-2.5 font-medium pr-4">{item.name}</td>
                      <td className="py-2.5 text-right font-mono font-bold px-2">
                        {item.result ?? '—'}
                      </td>
                      <td className="py-2.5 text-right text-gray-400 px-2">{item.unit ?? '—'}</td>
                      <td className="py-2.5 text-right text-gray-400 pl-2">{item.referenceRange ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {test.attachments?.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Attachments</p>
              <div className="flex flex-wrap gap-2">
                {test.attachments.map((url, k) => (
                  <a key={k} href={url} target="_blank" rel="noreferrer"
                    className="text-xs font-bold underline text-midnight hover:text-olive-dark">
                    File {k + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}