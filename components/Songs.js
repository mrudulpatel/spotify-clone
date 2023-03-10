import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className="text-white px-8 flex flex-col space-y-1 pb-28">
      {playlist?.tracks.items.map((track, i) => (
        <Song track={track} order={i} key={track.track.id} />
      ))}
    </div>
  );
}

export default Songs;
