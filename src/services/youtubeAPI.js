// src/services/youtubeAPI.js
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchLatestVideos = async (channelId) => {
  const URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`;

  try {
    const res = await fetch(URL);
    const data = await res.json();
    return data.items;
  } catch (err) {
    console.error("YouTube API Error:", err.message);
    return [];
  }
};

export const fetchVideoStats = async (videoIds) => {
  const ids = videoIds.join(',');
  const URL = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${ids}&part=statistics`;

  try {
    const res = await fetch(URL);
    const data = await res.json();
    return data.items;
  } catch (err) {
    console.error("Video Stats API Error:", err.message);
    return [];
  }
};
