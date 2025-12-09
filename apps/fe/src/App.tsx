export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
            Plugilo
          </h1>
          <p className="mb-8 text-lg text-slate-300">
            React + TypeScript + Tailwind + Rsbuild
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://rsbuild.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25"
            >
              Rsbuild Docs
            </a>
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-600 bg-slate-800/50 px-6 py-3 font-medium text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-700/50"
            >
              React Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

