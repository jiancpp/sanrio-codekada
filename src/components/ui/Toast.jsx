export default function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-midnight text-egg text-[13px] font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border-l-4 border-olive"
          style={{ animation: "slideIn 0.25s ease" }}
        >
          <span className="text-base">🔔</span>
          <span>Nudged <strong>{t.member}</strong> to take {t.med}</span>
        </div>
      ))}
    </div>
  );
}