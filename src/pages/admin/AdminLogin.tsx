import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/cmsService';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
            360°
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">Manage homepage, portfolio, services and CMS content.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none ring-0 focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none ring-0 focus:border-slate-400"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
