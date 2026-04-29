import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/layout/Logo';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast('Bem-vindo de volta!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@sweattrack.com', password: 'demo1234' });

  return (
    <div className="min-h-screen bg-surface-0 flex">
      {/* Left decoration (desktop) */}
      <div className="hidden lg:flex flex-1 bg-surface-1 border-r border-border relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-red-glow" />
        <div className="relative z-10 text-center px-12">
          <Logo size="xl" className="justify-center mb-8" />
          <h2 className="text-3xl font-black mb-4">Monitore.<br />Analise.<br />Supere.</h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
            Plataforma clínica de monitoramento de hidratação e performance esportiva.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[['82%', 'Hidratação Média'], ['1.2 L/h', 'Taxa de Suor'], ['94%', 'Índice Hídrico'], ['18h', 'Próx. Treino']].map(([v, l]) => (
              <div key={l} className="bg-surface-2 border border-border rounded-xl p-4">
                <p className="text-xl font-black text-gradient">{v}</p>
                <p className="text-xs text-white/40 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black mb-1">Bem-vindo de volta</h1>
            <p className="text-white/40 text-sm">Entre na sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={set('email')}
              icon={<Mail size={16} />}
              required
            />
            <Input
              label="Senha"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              icon={<Lock size={16} />}
              suffix={
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
              required
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" variant="primary" size="xl" loading={loading}>
              Entrar
            </Button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2.5 text-xs text-white/30 hover:text-white/60 transition-colors border border-dashed border-border hover:border-border-bright rounded-xl"
            >
              Preencher com conta demo
            </button>
          </div>

          <p className="text-center text-sm text-white/40 mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-primary-light transition-colors">
              Cadastrar
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
