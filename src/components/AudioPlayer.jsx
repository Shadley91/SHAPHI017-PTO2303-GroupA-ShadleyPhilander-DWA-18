import { useState, useEffect } from "react";

const AudioPlayer = () => {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((response) => response.json())
      .then((data) => {
        const audioData = {
          audioUrl: data.episodes[0].audioUrl, // Assuming we're taking the first episode's audio URL
          showName: data.showName,
          episodeName: data.episodes[0].episodeName,
          progress: 0, // User progress in seconds
        };

        const audioElement = new Audio(audioData.audioUrl);
        setAudio(audioElement);

        audioElement.addEventListener("loadedmetadata", () => {
          setDuration(audioElement.duration);
          audioElement.currentTime = audioData.progress;
          setCurrentTime(audioData.progress);
          setLoading(false);
        });

        audioElement.addEventListener("timeupdate", () => {
          setCurrentTime(audioElement.currentTime);
        });
      });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleClose = (event) => {
    const confirmationMessage =
      "Are you sure you want to close? Your audio is still playing.";
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleClose);

    return () => {
      window.removeEventListener("beforeunload", handleClose);
    };
  }, []);

  // Reset user progress
  const resetProgress = () => {
    // Clear user progress from localStorage or database
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <h3>{audio && audio.showName}</h3>
            <p>{audio && audio.episodeName}</p>
            <p>
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
          <div>
            <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
            <button onClick={resetProgress}>Reset Progress</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
