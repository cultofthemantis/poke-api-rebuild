"use client";

import { useEffect } from "react";
import { useState } from "react";
import { getFullPokemon } from "@/services/pokemonService";

export default function Home() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);

  const handleSearch = async () => {
    if (!search) return;

    if (!isNaN(Number(search)) && Number(search) > 649) {
      alert("Only Gen 1–5 (1–649)");
      return;
    }

    const data = await getFullPokemon(search);
    setPokemon(data);
  };

  const handleRandom = async () => {
    const id = Math.floor(Math.random() * 649) + 1;
    const data = await getFullPokemon(id);
    setPokemon(data);
  };

  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const saveFavorites = (updated: any[]) => {
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const addFavorite = () => {
    if (!pokemon) return;

    const exists = favorites.some((fav) => fav.id === pokemon.id);
    if (exists) return;

    const updated = [...favorites, pokemon];
    saveFavorites(updated);
  };

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((fav) => fav.id !== id);
    saveFavorites(updated);
  };
  const typeColors: Record<string, string> = {
    grass: "bg-green-200",
    fire: "bg-red-350",
    water: "bg-blue-200",
    electric: "bg-yellow-300",
    psychic: "bg-pink-400",
    ice: "bg-cyan-300",
    dragon: "bg-purple-500",
    dark: "bg-gray-700",
    fairy: "bg-pink-200",
    normal: "bg-gray-300",
    fighting: "bg-orange-500",
    flying: "bg-indigo-300",
    poison: "bg-purple-400",
    ground: "bg-yellow-600",
    rock: "bg-yellow-700",
    bug: "bg-lime-500",
    ghost: "bg-indigo-700",
    steel: "bg-gray-400",
  };
  const bgColor =
    pokemon && typeColors[pokemon.type?.toLowerCase()]
      ? typeColors[pokemon.type.toLowerCase()]
      : "bg-white";

  const [isShiny, setIsShiny] = useState(false);
  useEffect(() => {
    setIsShiny(false);
  }, [pokemon]);

  //going to be honest i reused a lot of my old code from the last one just cleaned it up a bit
  return (
    <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      <div>
        {/* SEARCH BAR */}
        <div className="flex gap-4 mb-6">
          <input
            className="p-2 rounded border-4 border-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Pokémon"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-500 px-4 py-2 rounded"
          >
            Search
          </button>
          <button
            onClick={handleRandom}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Random
          </button>
          <button
            onClick={addFavorite}
            className="bg-yellow-500 px-4 py-2 rounded mt-2"
          >
            ⭐ Add to Favorites
          </button>
          <button
            onClick={() => setIsShiny(!isShiny)}
            className="bg-purple-500 px-4 py-2 rounded mt-2"
          >
            {isShiny ? "Show Normal" : "Show Shiny ✨"}
          </button>
        </div>
        {/* Display Pokemon */}
        {pokemon && (
          <div
            className={`flex-row  text-center border-2 border-black p-4 rounded-lg ${bgColor} transition-colors duration-500`}
          >
            <h1 className="text-3xl font-bold">
              {pokemon.name} #{pokemon.id}
            </h1>

            <img
              src={isShiny ? pokemon.shiny : pokemon.image}
              className="mx-auto transition-all duration-300 h-50"
            />

            <p className="text-lg">Location: {pokemon.location}</p>
            <p className="text-xl">
              Type:{" "}
              {pokemon.type.charAt(0).toUpperCase() + pokemon.type.slice(1)}
            </p>

            {/* Moves */}
            <h2 className="mt-4 py-4 font-semibold  border-black">Moves</h2>
            <ul className="grid grid-cols-2 gap-2">
              {pokemon.moves.map((m: string, i: number) => (
                <li key={i}>{m}</li>
              ))}
            </ul>

            {/* Abilities */}
            <h2 className="mt-4 font-semibold">Abilities</h2>
            <ul>
              {pokemon.abilities.map((a: string, i: number) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            {/* Evolutions */}
            <div className="flex gap-4 justify-center mt-6">
              {pokemon.evolutions.map((evo: any, i: number) => (
                <div key={i} className="w-16 h-16 bg-gray-400 rounded-lg">
                  <img
                    src={evo.image}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-2 border-black p-4 rounded-lg h-fit">
        <h2 className="text-xl font-bold mb-4">⭐ Favorites</h2>

        {favorites.length === 0 && <p>No favorites yet</p>}

        <div className="flex flex-col gap-3">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="flex items-center justify-between bg-gray-200 p-2 rounded cursor-pointer"
              onClick={async () => {
                const data = await getFullPokemon(fav.id);
                setPokemon(data);
              }}
            >
              <div className="flex items-center gap-2">
                <img src={fav.image} className="w-10 h-10" />
                <span className="capitalize">{fav.name}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.id);
                }}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
