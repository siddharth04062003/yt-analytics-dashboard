import React, { useEffect, useState } from "react";
import Chart from "../components/Chart"
import VideoCard from "../components/VideoCard"
import dotenv from "dotenv";
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;

console.log("API_KEY:", API_KEY);
console.log("CHANNEL_ID:", CHANNEL_ID);


const Dashboard = () => {
  const [channelStats, setChannelStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("30"); // default 30 days

  const fetchChannelStats = async () => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      setChannelStats(data.items[0].statistics);
    }
  };

  const fetchVideos = async () => {
    const res1 = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const data1 = await res1.json();
    if (!data1.items || data1.items.length === 0) return;

    const uploadsPlaylistId = data1.items[0].contentDetails.relatedPlaylists.uploads;

    const res2 = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${API_KEY}`
    );
    const data2 = await res2.json();

    const videoIds = data2.items.map((item) => item.snippet.resourceId.videoId).join(",");
    if (!videoIds) return;

    const res3 = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`
    );
    const data3 = await res3.json();
    setVideos(data3.items);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchChannelStats();
      await fetchVideos();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter videos by published date
  const now = new Date();
  const filteredVideos = videos.filter((video) => {
    const publishedDate = new Date(video.snippet.publishedAt);
    if (filter === "7") {
      return (now - publishedDate) / (1000 * 60 * 60 * 24) <= 7;
    } else if (filter === "30") {
      return (now - publishedDate) / (1000 * 60 * 60 * 24) <= 30;
    }
    return true; // all
  });

  // Videos published in last 24 hours for latest comments and views
  const last24hVideos = videos.filter(
    (video) => (now - new Date(video.snippet.publishedAt)) / (1000 * 60 * 60) <= 24
  );

  // Aggregate latest stats
  const latestViews = last24hVideos.reduce((acc, v) => acc + Number(v.statistics.viewCount), 0);
  const latestLikes = last24hVideos.reduce((acc, v) => acc + (v.statistics.likeCount ? Number(v.statistics.likeCount) : 0), 0);
  const latestComments = last24hVideos.reduce((acc, v) => acc + (v.statistics.commentCount ? Number(v.statistics.commentCount) : 0), 0);

  if (loading)
    return <div className="loading">Loading your YouTube analytics...</div>;

  return (
    <div className="container">
      <h1>Your YouTube Channel Analytics</h1>

      <div className="section" style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
        <div>
          <h3>{channelStats.subscriberCount}</h3>
          <p>Subscribers</p>
        </div>
        <div>
          <h3>{channelStats.viewCount}</h3>
          <p>Total Views</p>
        </div>
        <div>
          <h3>{channelStats.videoCount}</h3>
          <p>Videos</p>
        </div>
      </div>

      {/* Date filter */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="dateFilter" style={{ marginRight: "10px", fontWeight: "600" }}>
          Filter videos by:
        </label>
        <select
          id="dateFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All videos</option>
        </select>
      </div>

      <div className="section">
        <h2>Views on Filtered Videos</h2>
        <Chart videos={filteredVideos} />
      </div>

      <div className="section">
        <h2>Filtered Videos</h2>
        <div className="cards-grid">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      <div className="section" style={{ textAlign: "center" }}>
        <h2>Latest Comments & Views (Last 24 hours)</h2>
        <p style={{ fontSize: "1.1rem" }}>
          <strong>Views:</strong> {latestViews.toLocaleString()} &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Likes:</strong> {latestLikes.toLocaleString()} &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Comments:</strong> {latestComments.toLocaleString()}
        </p>
        {last24hVideos.length === 0 && <p>No videos uploaded in the last 24 hours.</p>}
      </div>
    </div>
  );
};

export default Dashboard;