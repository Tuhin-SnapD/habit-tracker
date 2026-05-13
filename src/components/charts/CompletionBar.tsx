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
          stroke="#8B847C"
          fontSize={11}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#8B847C"
          fontSize={12}
          width={120}
        />
        <Tooltip
          cursor={{ fill: 'rgba(139,132,124,0.08)' }}
          contentStyle={{
            backgroundColor: '#FBF8F4',
            border: '1px solid rgba(139,132,124,0.25)',
            borderRadius: 8,
          }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
