"use client";

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

  //going to be honest i reused a lot of my old code from the last one just cleaned it up a bit
  return (
    <main className="p-8 flex flex-col items-center gap-6">
      
      <div className="flex gap-4">
        <input
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Pokémon"
        />
        <button onClick={handleSearch} className="bg-gray-500 px-4 py-2 rounded">
          Search
        </button>
        <button onClick={handleRandom} className="bg-blue-500 px-4 py-2 rounded">
          Random
        </button>
      </div>

      {/* Display */}
      {pokemon && (
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {pokemon.name} #{pokemon.id}
          </h1>

          <img src={pokemon.image} className="mx-auto" />

          <p className="text-lg">Location: {pokemon.location}</p>
          <p className="text-xl">Type: {pokemon.type}</p>

          {/* Moves */}
          <h2 className="mt-4 font-semibold">Moves</h2>
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
    </main>
  );
}