export default function HeatmapChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['8am', '10am', '12pm', '2pm', '4pm', '6pm'];
  
  // Intensity values (0-100)
  const heatmapData = [
    [45, 65, 85, 90, 75, 60],
    [50, 70, 88, 92, 80, 65],
    [55, 75, 92, 95, 85, 70],
    [52, 72, 90, 93, 82, 68],
    [48, 68, 85, 88, 78, 62],
    [30, 40, 55, 60, 50, 35],
    [25, 35, 45, 50, 40, 30],
  ];

  const getHeatColor = (value: number) => {
    if (value >= 90) return 'bg-teal-600';
    if (value >= 80) return 'bg-teal-500';
    if (value >= 70) return 'bg-teal-400';
    if (value >= 60) return 'bg-teal-300';
    if (value >= 50) return 'bg-amber-300';
    if (value >= 40) return 'bg-amber-200';
    return 'bg-gray-200';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Utilization Hours</h3>
      <div className="space-y-2">
        <div className="flex gap-2 mb-2">
          <div className="w-12"></div>
          {hours.map((hour) => (
            <div key={hour} className="flex-1 text-xs text-gray-600 text-center">
              {hour}
            </div>
          ))}
        </div>
        {days.map((day, dayIndex) => (
          <div key={day} className="flex gap-2 items-center">
            <div className="w-12 text-xs text-gray-600">{day}</div>
            {heatmapData[dayIndex].map((value, hourIndex) => (
              <div
                key={`${day}-${hourIndex}`}
                className={`flex-1 h-8 rounded ${getHeatColor(value)} hover:ring-2 hover:ring-teal-500 transition-all cursor-pointer group relative`}
                title={`${day} ${hours[hourIndex]}: ${value}%`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-white drop-shadow">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-600">Low</span>
          <div className="flex gap-1">
            <div className="w-6 h-3 rounded bg-gray-200"></div>
            <div className="w-6 h-3 rounded bg-amber-200"></div>
            <div className="w-6 h-3 rounded bg-amber-300"></div>
            <div className="w-6 h-3 rounded bg-teal-300"></div>
            <div className="w-6 h-3 rounded bg-teal-400"></div>
            <div className="w-6 h-3 rounded bg-teal-500"></div>
            <div className="w-6 h-3 rounded bg-teal-600"></div>
          </div>
          <span className="text-xs text-gray-600">High</span>
        </div>
      </div>
    </div>
  );
}
