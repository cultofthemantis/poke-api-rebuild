

export const formatText = (text: string): string => {
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};



export const getFullPokemon = async (value: string | number) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
  const data = await res.json();

  // location
  const locationRes = await fetch(data.location_area_encounters);
  const locationData = await locationRes.json();

  const location =
    locationData.length > 0
      ? formatText(locationData[0].location_area.name)
      : "Unknown";

  // evolutions
  const speciesRes = await fetch(data.species.url);
  const speciesData = await speciesRes.json();

  const evoRes = await fetch(speciesData.evolution_chain.url);
  const evoData = await evoRes.json();

  const evoChain: string[] = [];
  let current = evoData.chain;

  while (current) {
    evoChain.push(current.species.name);
    current = current.evolves_to[0];
  }

  // fetch evo images
  const evolutions = await Promise.all(
    evoChain.map(async (name: string) => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      const evoPokemon = await res.json();

      return {
        name,
        image: evoPokemon.sprites.front_default,
      };
    })
  );

  return {
    id: data.id,
    name: formatText(data.name),
    image: data.sprites.front_default,
    type: data.types[0].type.name,
    location,
    moves: data.moves.slice(0, 12).map((m: any) =>
      formatText(m.move.name)
    ),
    abilities: data.abilities.slice(0, 20).map((a: any) =>
      formatText(a.ability.name)
    ),
    evolutions,
  };
};

