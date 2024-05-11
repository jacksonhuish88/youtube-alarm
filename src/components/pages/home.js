import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import "../css/home.css";

function AlarmApp() {
  const [link, setLink] = useState('');
  const [time, setTime] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [play, setPlay] = useState(false);
  const [alarmSet, setAlarmSet] = useState(false);
  const [useMilitaryTime, setUseMilitaryTime] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      let suffix = hours >= 12 ? ' PM' : ' AM';

      if (!useMilitaryTime) {
        hours = hours % 12 || 12; // Convert hour to non-military time format
      } else {
        suffix = ''; // No suffix for military time
        hours = hours.toString().padStart(2, '0'); // Pad hours to ensure military format
      }

      const currentTimeFormatted = `${hours}:${minutes}${suffix}`;
      setCurrentTime(currentTimeFormatted);

      if (currentTimeFormatted.replace(' ', '') === formatAlarmTime(time).replace(' ', '') && alarmSet) {
        setPlay(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time, useMilitaryTime, alarmSet]);

  const formatAlarmTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    let formattedHours = parseInt(hours, 10);
    let suffix = formattedHours >= 12 ? ' PM' : ' AM';

    if (!useMilitaryTime) {
      formattedHours = formattedHours % 12 || 12;
    } else {
      suffix = '';
      formattedHours = formattedHours.toString().padStart(2, '0');
    }

    return `${formattedHours}:${minutes}${suffix}`;
  };

  const handleAlarmToggle = (event) => {
    event.preventDefault();
    if (alarmSet) {
      setPlay(false);
      setAlarmSet(false);
      setMuted(true);
    } else {
      setPlay(false);
      setAlarmSet(true);
      setMuted(false);
    }
  };

  return (
    <div className="container pt-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <form onSubmit={handleAlarmToggle} className="text-center">
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter YouTube Video URL"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group form-check">
              <input
                type="checkbox"
                checked={useMilitaryTime}
                onChange={() => setUseMilitaryTime(!useMilitaryTime)}
                className="form-check-input"
              />
              <label className="form-check-label">Use Military Time</label>
            </div>
            <button type="submit" className="btn btn-primary">
              {alarmSet ? "Turn Off Alarm" : "Set Alarm"}
            </button>
          </form>
          <div className="text-center current-time">
            Current Time: {currentTime}
                {alarmSet && <p>Alarm set for {formatAlarmTime(time)}. Waiting to play...</p>}
                {play && (
                <div className="w-100 d-flex justify-content-center">
                    <ReactPlayer
                    url={link}
                    playing={play}
                    controls={true}
                    muted={muted}
                    width="100%"  // Make sure it is responsive
                    className="react-player"
                    />
                </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlarmApp;
