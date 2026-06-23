import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">CRM System</div>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="btn-secondary">
              Dashboard
            </Link>
            <Link href="/login" className="btn-primary">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Professional CRM Platform
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Manage leads, deals, and customer relationships efficiently
          </p>
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2">🎯 Lead Management</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Capture and nurture leads from multiple sources
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2">📊 Sales Pipeline</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Visualize your sales process with an intuitive pipeline
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2">📈 Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Get insights with real-time reports and dashboards
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2024 CRM System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
