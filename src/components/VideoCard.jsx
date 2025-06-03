import React from "react";

const VideoCard = ({ video }) => {
  const { snippet, statistics } = video;
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div
      className="video-card"
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
        <img
          src={snippet.thumbnails.medium.url}
          alt={snippet.title}
          style={{ width: "100%", height: "160px", objectFit: "cover" }}
        />
        <div style={{ padding: "15px" }}>
          <h3
            style={{
              fontSize: "16px",
              marginBottom: "10px",
              fontWeight: "600",
              color: "#222",
            }}
            title={snippet.title}
          >
            {snippet.title.length > 45 ? snippet.title.slice(0, 45) + "..." : snippet.title}
          </h3>
          <p style={{ margin: "4px 0" }}>
            <strong>Views:</strong> {Number(statistics.viewCount).toLocaleString()}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Likes:</strong> {statistics.likeCount ? Number(statistics.likeCount).toLocaleString() : "N/A"}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Comments:</strong> {statistics.commentCount ? Number(statistics.commentCount).toLocaleString() : "N/A"}
          </p>
        </div>
      </a>
    </div>
  );
};

export default VideoCard;
