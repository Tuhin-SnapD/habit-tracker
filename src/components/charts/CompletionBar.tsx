import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type Datum = { name: string; value: number; color: string };

type Props = { data: Datum[]; max: number };

export function CompletionBar({ data, max }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-8">
        No data yet — toggle a habit to see this chart fill in.
      </p>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 32)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
      >
        <XAxis
          type="number"
          domain={[0, max]}
          stroke="currentColor"
          fontSize={11}
          allowDecimals={false}
          opacity={0.5}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="currentColor"
          fontSize={12}
          width={120}
          opacity={0.5}
        />
        <Tooltip
          cursor={{ fill: 'rgba(139,132,124,0.08)' }}
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, #FBF8F4)',
            border: '1px solid var(--tooltip-border, rgba(139,132,124,0.25))',
            borderRadius: 8,
            color: 'var(--tooltip-color, inherit)',
          }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={600}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
