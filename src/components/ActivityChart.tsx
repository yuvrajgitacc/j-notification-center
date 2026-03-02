import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const data = [
  { day: "Mon", alerts: 8 },
  { day: "Tue", alerts: 14 },
  { day: "Wed", alerts: 11 },
  { day: "Thu", alerts: 19 },
  { day: "Fri", alerts: 7 },
  { day: "Sat", alerts: 4 },
  { day: "Sun", alerts: 12 },
];

const ActivityChart = () => {
  return (
    <motion.div
      className="glass-card rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-sm font-medium text-muted-foreground tracking-wider uppercase mb-4">
        Weekly Activity
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              stroke="hsl(215 15% 50%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215 15% 50%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(220 20% 12% / 0.9)",
                border: "1px solid hsl(220 15% 22% / 0.5)",
                borderRadius: "8px",
                color: "hsl(210 20% 92%)",
                fontSize: "12px",
                backdropFilter: "blur(10px)",
              }}
            />
            <Line
              type="monotone"
              dataKey="alerts"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2.5}
              dot={{ fill: "hsl(199 89% 48%)", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "hsl(199 89% 48%)", stroke: "hsl(199 89% 48% / 0.3)", strokeWidth: 8 }}
              className="neon-line"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ActivityChart;
