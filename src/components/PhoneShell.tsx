export default function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm min-h-screen bg-slate-100 flex flex-col">{children}</div>
    </div>
  );
}
