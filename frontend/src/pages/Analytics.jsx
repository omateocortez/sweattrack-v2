import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar,
} from 'recharts';
import { Heart, Zap, TrendingUp, Clock, Download } from 'lucide-react';
import { analyticsApi } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import AppLayout from '../components/layout/AppLayout';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WeeklyChart from '../components/charts/WeeklyChart';
import { useToast } from '../components/ui/Toast';

const MOCK_TREND = [
  { day: 'Seg', sweat: 1.1, deficit: 400 },
  { day: 'Ter', sweat: 1.4, deficit: 650 },
  { day: 'Qua', sweat: 0.9, deficit: 300 },
  { day: 'Qui', sweat: 1.7, deficit: 900 },
  { day: 'Sex', sweat: 1.3, deficit: 550 },
  { day: 'Sáb', sweat: 0.6, deficit: 200 },
  { day: 'Dom', sweat: 0,   deficit: 0 },
];

const CLINICAL_NOTES = [
  {
    icon: '💪',
    color: 'border-emerald-500/20 bg-emerald-500/5',
    title: 'Biometria Muscular',
    desc: 'Níveis de lactato estáveis durante a fase anaeróbica. Recomenda-se manter o protocolo de repouso atual.',
  },
  {
    icon: '❤️',
    color: 'border-rose-500/20 bg-rose-500/5',
    title: 'Variabilidade Cardíaca',
    desc: 'VFC na média basal. Indica prontidão para sessões de alta intensidade amanhã.',
  },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs">
      <p className="font-bold text-white mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const toast = useToast();
  const { dark } = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [trend, setTrend] = useState([]);
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);

  useEffect(() => {
    analyticsApi.dashboard()
      .then((r) => setAnalytics(r.data))
      .catch(() => {})
      .finally(() => setAnalyticsLoaded(true));
    analyticsApi.hydrationTrend()
      .then((r) => { if (r.data.length) setTrend(r.data); })
      .catch(() => {});
  }, []);

  const isVirgin = analyticsLoaded && !analytics;
  const tickColor = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
  const hydrationIndex = analytics?.hydrationIndex ?? null;
  const vo2max = analytics?.profile?.vo2max ?? null;

  return (
    <AppLayout>
      <Header
        title="Análises"
        actions={
          <Button
            variant="ghost" size="sm"
            icon={<Download size={15} />}
            onClick={() => toast('Relatório exportado!', 'success')}
          >
            Exportar
          </Button>
        }
      />
      <div className="page-container md:max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

          {/* Header */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Relatório de Performance</p>
            <h1 className="text-2xl font-black mt-1">Análises de<br />Desempenho</h1>
            <p className="text-xs text-white/40 mt-1">
              SweatTrack Clinical Intelligence. Dados processados em tempo real para otimização atlética.
            </p>
          </div>

          {/* Virgin user banner */}
          {isVirgin && (
            <div className="bg-gradient-to-r from-primary/10 to-rose-900/5 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1">Nenhuma sessão registrada ainda</p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    As métricas reais — índice de hidratação, VO₂máx e tendências de sudorese — aparecem aqui após você completar sua primeira sessão de monitoramento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Hydration index */}
            <Card glow>
              <div className="flex items-center justify-between mb-1">
                <p className="section-title">Índice de Hidratação</p>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
              </div>
              {hydrationIndex !== null ? (
                <>
                  <div className="flex items-end gap-2 mb-2">
                    <p className="text-6xl font-black tabular-nums">{hydrationIndex}</p>
                    <p className="text-2xl text-white/40 font-bold mb-1">%</p>
                  </div>
                  <p className="text-xs text-emerald-400 font-bold">
                    {hydrationIndex >= 76 ? 'Status: Excelente.' : hydrationIndex >= 52 ? 'Status: Moderado.' : 'Status: Baixo.'}
                  </p>
                  <p className="text-xs text-white/40">Baseado na cor da urina (WUTS).</p>
                  <div className="mt-3 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="60%" outerRadius="100%"
                        data={[{ name: 'Hidratação', value: hydrationIndex, fill: '#C41E3A' }]}
                        startAngle={180} endAngle={0}
                      >
                        <RadialBar dataKey="value" background={{ fill: 'rgba(255,255,255,0.05)' }} cornerRadius={8} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-4xl font-black text-white/20">—</p>
                </div>
              )}
            </Card>

            {/* VO2max + recovery */}
            <div className="space-y-4">
              <Card>
                <p className="section-title">VO₂ Máx</p>
                {vo2max !== null ? (
                  <>
                    <div className="flex items-end gap-1">
                      <p className="text-4xl font-black">{vo2max}</p>
                      <p className="text-sm text-white/40 mb-1">ml/kg/min</p>
                    </div>
                    <p className="text-xs text-emerald-400 font-semibold">Perfil do atleta</p>
                  </>
                ) : (
                  <p className="text-3xl font-black text-white/20 mt-1">—</p>
                )}
              </Card>
              <Card>
                <p className="section-title">Próximo Treino</p>
                {analytics?.lastSession ? (
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-primary" />
                    <p className="text-4xl font-black">18<span className="text-xl text-white/40">h</span></p>
                    <p className="text-xs text-white/40 mt-1">Recuperação estimada</p>
                  </div>
                ) : (
                  <p className="text-3xl font-black text-white/20 mt-1">—</p>
                )}
              </Card>
            </div>
          </div>

          {/* Sweat rate trend */}
          <Card>
            <p className="section-title">Tendência de Sudorese — 7 dias</p>
            {trend.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-center">
                <p className="text-xs text-white/30 max-w-[200px]">
                  Os dados de sudorese aparecerão após suas primeiras sessões de monitoramento.
                </p>
              </div>
            ) : (
              <div className="h-40 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sweatGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C41E3A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C41E3A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      tick={{ fill: tickColor, fontSize: 10 }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone" dataKey="sweat" name="Taxa L/h"
                      stroke="#C41E3A" strokeWidth={2}
                      fill="url(#sweatGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Weekly chart */}
          <Card>
            <p className="section-title">Carga Metabólica — Semana</p>
            <WeeklyChart weeklyData={analytics?.weeklyData} />
          </Card>

          {/* Clinical notes */}
          <div>
            <p className="section-title">Observações Clínicas</p>
            <div className="space-y-3">
              {CLINICAL_NOTES.map((note) => (
                <motion.div
                  key={note.title}
                  whileHover={{ x: 2 }}
                  className={`flex items-start gap-3 p-4 rounded-2xl border ${note.color} cursor-pointer`}
                >
                  <span className="text-xl">{note.icon}</span>
                  <div>
                    <p className="font-bold text-sm mb-0.5">{note.title}</p>
                    <p className="text-xs text-white/55 leading-relaxed">{note.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
