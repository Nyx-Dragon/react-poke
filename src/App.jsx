import React, { useState, useEffect } from "react";
import SearchInput from "./components/SearchInput";
import PokemonResult from "./components/PokemonResult";
import PokemonStatsChart from "./components/PokemonStatsChart";
import "./App.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]); // Nombres en cadena evolutiva

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
        const data = await res.json();
        setAllPokemon(data.results);
      } catch {
        setError("Error al cargar la lista de Pokémon.");
      }
    };
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPokemon([]);
      setSelectedPokemons([]);
      setEvolutionChain([]);
      setError(null);
      return;
    }

    const matches = allPokemon.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(matches.slice(0, 10));
  }, [searchTerm, allPokemon]);

  // Función para extraer nombres de la cadena evolutiva recursivamente
  const extractEvolutionNames = (chainNode, names = []) => {
    names.push(chainNode.species.name);
    if (chainNode.evolves_to.length > 0) {
      chainNode.evolves_to.forEach(next => extractEvolutionNames(next, names));
    }
    return names;
  };

  const fetchAllForms = async (name) => {
    setLoading(true);
    setError(null);
    setSelectedPokemons([]);
    setEvolutionChain([]);

    try {
      // 1. Obtener datos base del Pokémon (para conseguir species.url)
      const baseDataRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!baseDataRes.ok) throw new Error("Pokémon no encontrado");
      const baseData = await baseDataRes.json();

      // 2. Obtener datos de la especie (para obtener variedades y evolución)
      const speciesRes = await fetch(baseData.species.url);
      if (!speciesRes.ok) throw new Error("Error al cargar especie");
      const speciesData = await speciesRes.json();

      // 3. Obtener variedades (formas)
      const varieties = speciesData.varieties;

      // 4. Peticiones para cada forma
      const promises = varieties.map(v =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${v.pokemon.name}`).then(res => {
          if (!res.ok) throw new Error("Error al cargar forma");
          return res.json();
        })
      );
      const formsData = await Promise.all(promises);

      // 5. Obtener cadena evolutiva completa
      if (speciesData.evolution_chain && speciesData.evolution_chain.url) {
        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        if (!evolutionRes.ok) throw new Error("Error al cargar cadena evolutiva");
        const evolutionData = await evolutionRes.json();

        const evoNames = extractEvolutionNames(evolutionData.chain);
        setEvolutionChain(evoNames);
      } else {
        setEvolutionChain([]);
      }

      // 6. Guardar todas las formas
      setSelectedPokemons(formsData);
      setFilteredPokemon([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Pokedex</h1>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />

      {filteredPokemon.length > 0 && (
        <ul className="suggestions">
          {filteredPokemon.map(p => (
            <li key={p.name} onClick={() => fetchAllForms(p.name)}>
              {p.name}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="loading">Cargando datos de Pokémon...</p>}
      {error && <p className="error">{error}</p>}

      {selectedPokemons.length > 0 && selectedPokemons.map(pokemon => (
        <PokemonResult key={pokemon.id} pokemon={pokemon} />
      ))}

      {/* Mostrar cadena evolutiva como enlaces */}
      {evolutionChain.length > 0 && (
        <div className="evolution-chain">
          <h2>Cadena evolutiva:</h2>
          <ul>
            {evolutionChain.map(name => (
              <li key={name}>
                <button onClick={() => fetchAllForms(name)}>{name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!searchTerm && selectedPokemons.length === 0 && !error && (
        <p>Empieza a escribir el nombre de un Pokémon para buscar.</p>
      )}
    </div>
  );
};

export default App;
