import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type Datum = { category: string; value: number };

const PALETTE = ['#A7D7C5', '#F4C7A1', '#C9B6E4', '#A9C6E8', '#E8B4BC', '#D3C5A0', '#B5D5A8'];

type Props = { data: Datum[] };

export function CategoryBar({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-8">
        No completions yet in this window.
      </p>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={Math.max(140, data.length * 36)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
      >
        <XAxis
          type="number"
          stroke="#8B847C"
          fontSize={11}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="category"
          stroke="#8B847C"
          fontSize={12}
          width={100}
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
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
