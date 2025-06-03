import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ videos }) => {
  // Prepare data for chart: video titles vs view count
  const data = videos.map((video) => ({
    name: video.snippet.title.length > 20 ? video.snippet.title.slice(0, 20) + "..." : video.snippet.title,
    views: Number(video.statistics.viewCount),
  }));

  return (
    <div style={{ width: "100%", height: 300, margin: "30px 0" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
