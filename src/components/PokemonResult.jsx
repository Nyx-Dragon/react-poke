import React from "react";
import PokemonStatsChart from "./PokemonStatsChart";

const PokemonResult = ({ pokemon }) => {
  const sprites = Object.values(pokemon.sprites).filter(
    (sprite) => typeof sprite === "string" && sprite
  );

  const hasAnyImage = pokemon.sprites.front_default || sprites.length > 0;

  return (
    <div className="pokemon-result">
      <p className="pokemon-name">{pokemon.name}</p>

      {pokemon.sprites.front_default ? (
        <img
          className="pokemon-image"
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          loading="lazy"
        />
      ) : (
        <p className="no-image-warning">Imagen principal no disponible</p>
      )}

      <div className="pokemon-types">
        <p>Tipos:</p>
        <ul>
          {pokemon.types.map(({ type }) => (
            <li key={type.name} className={`type-${type.name}`}>
              {type.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="pokemon-abilities">
        <p>Habilidades:</p>
        <ul>
          {pokemon.abilities.map(({ ability }) => (
            <li key={ability.name}>{ability.name}</li>
          ))}
        </ul>
      </div>

      <div className="pokemon-sprites">
        {sprites.length > 0 ? (
          sprites.map((spriteUrl, i) => (
            <img
              key={i}
              src={spriteUrl}
              alt={`${pokemon.name} sprite ${i}`}
              loading="lazy"
            />
          ))
        ) : (
          <p className="no-image-warning">No hay imágenes adicionales disponibles</p>
        )}
      </div>

      {pokemon.evolutionUrl && (
        <p>
          <a
            href={pokemon.evolutionUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver cadena evolutiva
          </a>
        </p>
      )}

      {/* ✅ Aquí el gráfico de stats */}
      <PokemonStatsChart pokemon={pokemon} />
    </div>
  );
};

export default PokemonResult;
