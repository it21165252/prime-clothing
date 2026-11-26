import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { PasswordInput } from '../components/PasswordInput';
import { isDemoBackend } from '../services';

export default function AuthPage() {
  const { customer, signIn, signUp } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const redirect = params.get('redirect') || '/account';
  const [mode, setMode] = useState<'signin' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) navigate(redirect, { replace: true });
  }, [customer, navigate, redirect]);

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    if (mode === 'signup' && !fullName.trim()) return setError('Please enter your name.');
    setBusy(true);
    const { error: err } = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, fullName);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    toast.success(mode === 'signin' ? 'Welcome back' : 'Welcome to Prime Clothing');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14 md:py-20">
      <div className="grid grid-cols-2 border-b border-neutral-200 mb-8">
        {(['signin', 'signup'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); }}
            className={`label pb-4 -mb-px border-b-2 ${mode === m ? 'border-ink' : 'border-transparent text-neutral-400'}`}
          >
            {m === 'signin' ? 'Sign in' : 'Join'}
          </button>
        ))}
      </div>
      <h1 className="font-display text-5xl font-extrabold">{mode === 'signin' ? 'Welcome back' : 'Join the crew'}</h1>
      <p className="text-sm text-neutral-500 mt-2">
        {mode === 'signin' ? 'Sign in to track orders and check out faster.' : 'Create an account for order tracking, early access and faster checkout.'}
      </p>

      <form onSubmit={submit} className="space-y-4 mt-8">
        {mode === 'signup' && (
          <label className="block">
            <span className="label !text-[0.65rem] block mb-1.5">Full name</span>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" required />
          </label>
        )}
        <label className="block">
          <span className="label !text-[0.65rem] block mb-1.5">Email</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="block">
          <span className="label !text-[0.65rem] block mb-1.5">Password</span>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required minLength={6} />
        </label>
        {error && <p className="text-sm text-prime" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full !h-14">
          {busy ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {isDemoBackend && (
        <p className="text-[11px] text-neutral-400 mt-6 leading-relaxed">
          Demo mode: accounts and orders are stored only in this browser until the Prime Clothing backend is connected.
        </p>
      )}
      <p className="text-sm text-neutral-500 mt-8 text-center">
        <Link to="/collections/all" className="underline">Continue shopping</Link>
      </p>
    </div>
  );
}
