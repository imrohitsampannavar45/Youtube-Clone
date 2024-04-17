import React, { useState, useEffect } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import jack from '../../assets/jack.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY } from '../../data'; // Assuming you have API_KEY exported from '../../data'
import moment from 'moment';
import { value_converter } from '../../data'; // Assuming you import value_converter from '../../data'
import { useParams } from 'react-router';

const PlayVideo = () => {
  const {videoId} = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items[0]));
  };

  const fetchOtherData = async () => {
    // Fetch channel data
    const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    await fetch(channelData_url)
      .then((res) => res.json())
      .then((data) => setChannelData(data.items[0]));

    // Fetch comment data
    const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
    await fetch(commentUrl)
      .then((res) => res.json())
      .then((data) => setCommentData(data.items));
  };

  useEffect(() => {
    fetchVideoData();
  },[videoId])
      

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  return (
    <div className="play-video">
      {/* Video Player */}
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>

      {/* Video Details */}
      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>{`${apiData ? value_converter(apiData.statistics.viewCount) : "0"} Views • ${moment(apiData ? apiData.snippet.publishedAt : null).fromNow()}`}</p>
        <div>
          <span>
            <img src={like} alt="" /> {apiData ? value_converter(apiData.statistics.likeCount) : "0"}
          </span>
          <span>
            <img src={dislike} alt="" /> {apiData ? value_converter(apiData.statistics.dislikeCount) : "0"}
          </span>
          <span>
            <img src={share} alt="" /> Share
          </span>
          <span>
            <img src={save} alt="" /> Save
          </span>
        </div>
      </div>

      {/* Publisher */}
      <hr />
      <div className="publisher">
        <img src={channelData ? channelData.snippet.thumbnails.default.url : jack} alt="" />
        <div>
          <p>{channelData ? channelData.snippet.title : "Rohit Sampannavar"}</p>
          <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>

      {/* Video Description and Comments */}
      <div className="vid-description">
        <p>Channel that makes Learning Easy</p>
        <p>Subscribe Rohit Sampannavar to Watch More</p>
        <hr />
        <h4>{commentData.length} Comments</h4>
        {commentData.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
            <div>
              <h3>{comment.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(comment.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
              <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
             
              <div className="comment-action">
                <img src={like} alt='' />
                <span>{value_converter(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                <img src={dislike} alt="" />
              </div>
            </div>
          </div>
          
        ))}
        
      </div>
    </div>
  );
};

export default PlayVideo;
