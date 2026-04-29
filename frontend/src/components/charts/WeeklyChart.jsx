import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MOCK_DATA = [
  { day: 'Seg', load: 65 },
  { day: 'Ter', load: 80 },
  { day: 'Qua', load: 45 },
  { day: 'Qui', load: 90 },
  { day: 'Sex', load: 72 },
  { day: 'Sáb', load: 30 },
  { day: 'Dom', load: 0 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs">
      <p className="font-bold text-white">{label}</p>
      <p className="text-white/60">{payload[0].value}% carga</p>
    </div>
  );
}

export default function WeeklyChart({ data = MOCK_DATA }) {
  const today = new Date().getDay();

  return (
    <div className="w-full h-28">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={16} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="load" radius={[6, 6, 4, 4]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.load > 0 ? (i === today - 1 ? '#C41E3A' : 'rgba(196,30,58,0.35)') : 'rgba(255,255,255,0.06)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
