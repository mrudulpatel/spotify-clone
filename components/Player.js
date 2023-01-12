import {
  HeartIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotiftApi = useSpotify();
  const songInfo = useSongInfo();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotiftApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing: " + data.body?.item);
        setCurrentTrackId(data.body?.item?.id);
      });

      spotiftApi.getMyCurrentPlaybackState().then((data) => {
        console.log("Now Playing: " + data.body);
        setIsPlaying(data?.body?.is_playing);
      });
    }
  };

  useEffect(() => {
    if (spotiftApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotiftApi, session]);

  const handlePlayPause = () => {
    spotiftApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body?.is_playing) {
        spotiftApi.pause();
        setIsPlaying(false);
      } else {
        spotiftApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotiftApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  return (
    <div className="h-20 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* LEFT */}
      <div className="flex item-center space-x-4 ">
        <img
          className="md:inline h-10 w-10"
          src={songInfo?.album?.images[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.map((artist) => artist?.name).join(", ")}</p>
        </div>
      </div>
      {/* MIDDLE */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      {/* RIGHT */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          onChange={(e) => {
            setVolume(Number(e.target.value));
          }}
          value={volume}
          type="range"
          min={0}
          max={100}
          id="volume"
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
