import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const healthData = [
  { name: 'Blood Pressure', value: 35, color: '#ff6b6b' },
  { name: 'Blood Sugar', value: 25, color: '#4ecdc4' },
  { name: 'Cholesterol', value: 20, color: '#45b7d1' },
  { name: 'Heart Rate', value: 20, color: '#96ceb4' }
];

const riskData = [
  { category: 'Overall Risk', percentage: 65 }
];

interface DataVisualizationProps {
  className?: string;
}

export function DataVisualization({ className }: DataVisualizationProps) {
  const getRiskColor = (percentage: number) => {
    if (percentage < 25) return 'hsl(var(--accent))'; // Green
    if (percentage < 50) return '#ffd93d'; // Yellow
    if (percentage < 75) return '#ff9f43'; // Orange
    return '#ff6b6b'; // Red
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Pie Chart */}
      <div className="bg-gradient-card p-6 rounded-lg border border-border">
        <h4 className="font-semibold text-foreground mb-4">Health Parameters Distribution</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={healthData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {healthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Bar */}
      <div className="bg-gradient-card p-6 rounded-lg border border-border">
        <h4 className="font-semibold text-foreground mb-4">Risk Assessment</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Percentage of Risk</span>
            <span className="font-bold text-foreground">65%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-6 relative overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: '65%', 
                background: `linear-gradient(90deg, 
                  hsl(var(--accent)) 0%, 
                  #ffd93d 25%, 
                  #ff9f43 50%, 
                  #ff6b6b 75%
                )`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-foreground mix-blend-difference">
                Medium Risk
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}