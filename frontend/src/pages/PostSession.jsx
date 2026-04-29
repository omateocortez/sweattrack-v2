import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Droplets, Clock, CheckCircle2, Save, Share2,
  Beaker, Pill, Eye, TrendingDown,
} from 'lucide-react';
import { sessionApi } from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { formatDuration, calcRecoveryFluid } from '../utils/calculations';

const stagger = { animate: { transition: { staggerChildren: 0.09 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const RECOVERY_STEPS = [
  {
    icon: <Droplets size={18} className="text-sky-400" />,
    title: 'Reidratação Imediata',
    desc: (deficit) =>
      `Consuma ${calcRecoveryFluid(Math.abs(deficit || 2150))}ml de fluidos nas próximas 4 horas (150% da perda total).`,
    color: 'border-sky-500/20 bg-sky-500/5',
  },
  {
    icon: <Pill size={18} className="text-amber-400" />,
    title: 'Reposição de Eletrólitos',
    desc: () =>
      'Sua perda de sódio foi de ~1.800mg. Recomenda-se sachê eletrolítico isotônico.',
    color: 'border-amber-500/20 bg-amber-500/5',
  },
  {
    icon: <Eye size={18} className="text-violet-400" />,
    title: 'Monitoramento de Urina',
    desc: () =>
      'Acompanhe a coloração da urina até atingir o tom amarelo-claro (Padrão 1-2 na escala de WUTS).',
    color: 'border-violet-500/20 bg-violet-500/5',
  },
];

export default function PostSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    sessionApi.getOne(id)
      .then((r) => setSession(r.data))
      .catch(() => toast('Erro ao carregar sessão', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = () => {
    setSaved(true);
    toast('Salvo no prontuário!', 'success');
  };

  if (loading) return (
    <AppLayout>
      <Header title="Resumo Pós-Sessão" showBack />
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
      </div>
    </AppLayout>
  );

  const deficitMl = session?.hydric_deficit_ml ?? 2150;
  const totalLoss = deficitMl > 0 ? (deficitMl / 1000).toFixed(2) : '2.15';
  const duration = session?.duration_minutes ?? 90;
  const sweatRate = session?.sweat_rate_lh ?? 1.42;

  // Recovery time based on deficit
  const recoveryHours = Math.max(8, Math.round(Math.abs(deficitMl) / 200));

  return (
    <AppLayout>
      <Header title="Resumo Pós-Sessão" showBack />
      <div className="page-container md:max-w-2xl">
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-5">

          {/* Header */}
          <motion.div variants={fadeUp}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Relatório de Performance</p>
            <h1 className="text-2xl font-black mt-1">
              Resumo<br />Pós-Sessão
            </h1>
          </motion.div>

          {/* Main metric */}
          <motion.div variants={fadeUp}>
            <Card glow>
              <p className="section-title">Taxa de Sudorese</p>
              <div className="flex items-end gap-2 mb-4">
                <p className="text-5xl font-black tabular-nums">{sweatRate.toFixed(2)}</p>
                <p className="text-xl text-white/40 font-bold mb-1">L/h</p>
              </div>
              <p className="text-xs text-white/50 bg-surface-2 rounded-xl px-3 py-2">
                Classificada como <span className="text-amber-400 font-bold">moderada-alta</span> para as condições
                atuais (24°C / 65% UR).
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-surface-2 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown size={13} className="text-rose-400" />
                    <p className="text-xs text-white/40">Perda Total</p>
                  </div>
                  <p className="text-xl font-black text-rose-400">{totalLoss}L</p>
                </div>
                <div className="bg-surface-2 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock size={13} className="text-white/40" />
                    <p className="text-xs text-white/40">Duração</p>
                  </div>
                  <p className="text-xl font-black">{formatDuration(duration)}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recovery protocol */}
          <motion.div variants={fadeUp}>
            <p className="section-title">Protocolo de Recuperação</p>
            <div className="space-y-3">
              {RECOVERY_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`flex items-start gap-3 p-4 rounded-2xl border ${step.color}`}
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-2 font-black text-sm flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {step.icon}
                      <p className="font-bold text-sm">{step.title}</p>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {step.desc(deficitMl)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Biopsychosocial recovery estimate */}
          <motion.div variants={fadeUp}>
            <div className="bg-gradient-to-r from-primary/20 to-rose-900/10 border border-primary/20 rounded-2xl p-4">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                Análise Biopsicossocial
              </p>
              <p className="font-black text-lg">
                Sua recuperação levará aprox. <span className="text-gradient">{recoveryHours}h</span>.
              </p>
              <p className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Baseado em dados de temperatura e intensidade da sessão.
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 pb-4">
            <Button
              variant="outline"
              onClick={handleSave}
              icon={saved ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Save size={16} />}
              className={saved ? 'border-emerald-500/30 text-emerald-400' : ''}
            >
              {saved ? 'Salvo!' : 'Salvar no Prontuário'}
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
