
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [{ name: 'score', value: score }];
  const scoreColor = score > 89 ? '#3FB950' : score > 49 ? '#DBAB09' : '#DA3633';

  return (
    <div className="relative w-48 h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="75%"
          outerRadius="90%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={20}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            fill={scoreColor}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900 dark:text-auditor-text-primary">{score}</span>
        <span className="text-sm text-gray-500 dark:text-auditor-text-secondary">/ 100</span>
      </div>
    </div>
  );
};

export default ScoreGauge;