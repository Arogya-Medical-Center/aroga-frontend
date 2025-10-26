import Link from 'next/link';

function Header({ onAddNew }: { onAddNew: () => void }) {
  try {
    return (
      <header className="bg-white border-b border-[var(--border-color)]" data-name="header" data-file="src/components/Header.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)] flex items-center justify-center">
                <div className="icon-calendar-check text-xl text-white"></div>
              </div>
              <h1 className="text-2xl font-bold">Appointments</h1>
            </div>
            <button onClick={onAddNew} className="btn btn-primary flex items-center gap-2">
              <div className="icon-plus text-base"></div>
              <span>New Appointment</span>
            </button>
          </div>
          
          <div className="flex gap-4">
            <Link href="/" passHref>
              <button
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  typeof window !== 'undefined' && window.location.pathname === '/'
                    ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Dashboard
              </button>
            </Link>
            <Link href="/calendar" passHref>
              <button
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  typeof window !== 'undefined' && window.location.pathname === '/calendar'
                    ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Calendar
              </button>
            </Link>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}

export default Header;