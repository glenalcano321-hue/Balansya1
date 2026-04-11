import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend?: number;
  trendLabel?: string;
}

export default function KPICard({ icon, label, value, subtext, trend, trendLabel }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-gray-900">{value}</span>
        {subtext && <span className="text-sm text-gray-500">{subtext}</span>}
      </div>
      {trend !== undefined && trend !== 0 && trendLabel && (
        <div className="flex items-center gap-1 mt-2">
          {trend > 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">{trendLabel}</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-500 font-medium">{trendLabel}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
