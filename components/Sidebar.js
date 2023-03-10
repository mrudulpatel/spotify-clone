import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  HeartIcon,
  RssIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import { NextRequest, NextResponse } from "next/server";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  console.log("You picked playlist id " + playlistId);
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        // setPlaylists(data.items);
        // console.log(data.items);
        setPlaylists(data.body.items);
        console.log(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-gray-300 text-xs lg:text-sm font-bold p-5 border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide hidden md:inline-flex sm:max-w-[12rem] lg:max-w-[15rem] pb-36">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p style={{ fontSize: "18px" }}>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5 " />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5 text-blue-600" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5 text-green-500" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* PLAYLISTS */}
        {playlists?.map((playlist) => (
          <p
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white"
            key={playlist.id}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
