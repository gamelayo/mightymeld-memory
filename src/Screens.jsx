import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import PropTypes from "prop-types";

const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="w-[80vw] h-[80vh] text-pink-500 bg-pink-100 rounded-lg">
        <div className="mt-24 text-center">
          <h1 className="p-3 font-bold text-3xl">Memory</h1>
          <p className="p-3">Flip over tiles looking for pairs</p>
        </div>
        <div className="py-10 text-center">
          <button
            onClick={start}
            className="bg-pink-500 text-white p-3 w-[10rem] rounded-full font-bold"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
}
StartScreen.propTypes = {
  start: PropTypes.func.isRequired,
};

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <div className="flex gap-3 pb-8 text-blue-500 text-xl font-semibold">
        <h1>Tries</h1>
        <span className="px-2 bg-blue-100"> {tryCount}</span>
      </div>
      <div
        className="text-white p-3 grid grid-cols-4 gap-4 w-[330px] md:w-[390px]
      bg-blue-100 rounded-lg"
      >
        {getTiles(16).map((tile, i) => (
          <Tile key={i} flip={() => flip(i)} {...tile} />
        ))}
      </div>
    </div>
  );
}
PlayScreen.propTypes = {
  end: PropTypes.func.isRequired,
};
