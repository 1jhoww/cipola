// A short fade on every navigation. Plain CSS (see .page-fade in globals.css),
// so pages that need no animation library do not download one for this.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
