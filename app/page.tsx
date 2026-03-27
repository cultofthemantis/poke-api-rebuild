"use client";

import { useEffect, useState } from "react";
import { getFullPokemon } from "@/services/pokemonService";

export default function Home() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isShiny, setIsShiny] = useState(false);

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

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
    setIsShiny(false);
  }, [pokemon]);

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

  const saveFavorites = (updated: any[]) => {
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const addFavorite = () => {
    if (!pokemon) return;
    if (favorites.some((fav) => fav.id === pokemon.id)) return;
    saveFavorites([...favorites, pokemon]);
  };

  const removeFavorite = (id: number) => {
    saveFavorites(favorites.filter((fav) => fav.id !== id));
  };


  //a lot of code is reused form my previous PokeAPI
  return (
    <main className="min-h-screen p-6 md:p-10 bg-surface font-sans max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      {/* LEFT: Search + Pokémon Display */}
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            className="flex-1 p-3 rounded-xl border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Pokémon by name or ID..."
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl bg-gray-500 text-white font-bold hover:bg-gray-600 transition"
          >
            Search
          </button>
          <button
            onClick={handleRandom}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          >
            Random
          </button>
          <button
            onClick={addFavorite}
            className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
          >
            ⭐ Add to Favorites
          </button>
          <button
            onClick={() => setIsShiny(!isShiny)}
            className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition"
          >
            {isShiny ? "Show Normal" : "Show Shiny ✨"}
          </button>
        </div>

        {/* Pokémon Display */}
        {pokemon && (
          <div
            className={`rounded-3xl shadow-lg p-6 text-center transition-colors duration-500 ${bgColor}`}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 capitalize">
              {pokemon.name} #{pokemon.id}
            </h1>

            <div className="flex justify-center mb-4">
              <img
                src={isShiny ? pokemon.shiny : pokemon.image}
                className="h-56 md:h-64 object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            <p className="text-lg mb-2">Location: {pokemon.location}</p>
            <p className="text-lg font-semibold mb-4">
              Type: {pokemon.type.charAt(0).toUpperCase() + pokemon.type.slice(1)}
            </p>

            {/* Moves */}
            <h2 className="mt-4 py-2 font-semibold border-b-2 border-gray-400">
              Moves
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {pokemon.moves.map((m: string, i: number) => (
                <li
                  key={i}
                  className="bg-surface-container-low p-1 rounded text-sm md:text-base"
                >
                  {m}
                </li>
              ))}
            </ul>

            {/* Abilities */}
            <h2 className="mt-4 py-2 font-semibold border-b-2 border-gray-400">
              Abilities
            </h2>
            <ul className="flex flex-wrap justify-center gap-2 mt-2">
              {pokemon.abilities.map((a: string, i: number) => (
                <li
                  key={i}
                  className="bg-surface-container-low px-3 py-1 rounded-full text-sm md:text-base"
                >
                  {a}
                </li>
              ))}
            </ul>

            {/* Evolutions */}
            <div className="flex gap-4 justify-center mt-6 flex-wrap">
              {pokemon.evolutions.map((evo: any, i: number) => (
                <div
                  key={i}
                  className="w-20 h-20 md:w-24 md:h-24 bg-surface-container-low rounded-lg p-2 shadow-inner"
                >
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

      {/* RIGHT: Favorites */}
      <div className="border-2 border-gray-400 rounded-3xl p-6 h-fit bg-surface-container-low shadow-lg">
        <h2 className="text-xl font-bold mb-4">⭐ Favorites</h2>
        {favorites.length === 0 && <p>No favorites yet</p>}

        <div className="flex flex-col gap-3">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="flex items-center justify-between bg-surface-container-high p-2 rounded cursor-pointer hover:bg-surface-container-hover transition"
              onClick={async () => {
                const data = await getFullPokemon(fav.id);
                setPokemon(data);
              }}
            >
              <div className="flex items-center gap-2">
                <img src={fav.image} className="w-10 h-10" />
                <span className="capitalize font-medium">{fav.name}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.id);
                }}
                className="text-red-500 text-sm font-bold"
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