import React, { useState } from "react";
import usePokemonDetail from "./hooks/usePokemonDetail";
import ErrorDisplay from "./components/ErrorDisplay";

const ComparePokemon = () => {
  const [pokemon1Id, setPokemon1Id] = useState("");
  const [pokemon2Id, setPokemon2Id] = useState("");

  const p1 = usePokemonDetail(pokemon1Id);
  const p2 = usePokemonDetail(pokemon2Id);

  const isLoading = p1.isLoading || p2.isLoading;
  const hasError = p1.error || p2.error;

  const getStatTotal = (pokemon) =>
    pokemon?.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  const renderStatComparison = () => {
    return p1.pokemon.stats.map((stat, index) => {
      const stat1 = stat.base_stat;
      const stat2 = p2.pokemon.stats[index].base_stat;
      const diff = stat1 - stat2;

      return (
        <tr key={stat.stat.name}>
          <td>{stat.stat.name}</td>
          <td>{stat1}</td>
          <td className={diff > 0 ? "positive" : diff < 0 ? "negative" : ""}>
            {diff > 0 ? `+${diff}` : diff}
          </td>
          <td>{stat2}</td>
        </tr>
      );
    });
  };

  const renderAbilities = (abilities) =>
    abilities.map((a) => (
      <li key={a.ability.name}>
        {a.ability.name}
        {a.is_hidden && <span className="hidden-ability"> (Hidden)</span>}
      </li>
    ));

  const renderTypes = (types) =>
    types.map((t) => (
      <span key={t.type.name} className={`type ${t.type.name}`}>
        {t.type.name}
      </span>
    ));

  const renderEvolution = (evolution) =>
    evolution && evolution.chain ? (
      <ul>
        {(() => {
          const chain = [];
          let current = evolution.chain;
          while (current) {
            chain.push(current.species.name);
            current = current.evolves_to[0];
          }
          return chain.map((name, idx) => (
            <li key={idx}>
              {name} {idx < chain.length - 1 && "→"}
            </li>
          ));
        })()}
      </ul>
    ) : (
      <p>No evolution data.</p>
    );

  return (
    <div className="compare-container">
      <h2>Compare Pokémon</h2>

      <div className="compare-inputs">
        <input
          type="number"
          min="1"
          max="1010"
          value={pokemon1Id}
          onChange={(e) => setPokemon1Id(e.target.value)}
          placeholder="Enter First Pokémon ID"
        />
        <input
          type="number"
          min="1"
          max="1010"
          value={pokemon2Id}
          onChange={(e) => setPokemon2Id(e.target.value)}
          placeholder="Enter Second Pokémon ID"
        />
      </div>

      {isLoading && <p>Loading Pokémon...</p>}

      {hasError && (
        <>
          {p1.error && (
            <ErrorDisplay
              type="api"
              message={`Error loading Pokémon 1: ${p1.error.message}`}
            />
          )}
          {p2.error && (
            <ErrorDisplay
              type="api"
              message={`Error loading Pokémon 2: ${p2.error.message}`}
            />
          )}
        </>
      )}

      {p1.pokemon && p2.pokemon && (
        <div className="comparison-panel">
          <div className="pokemon-column">
            <img
              src={
                p1.pokemon.sprites?.other["official-artwork"].front_default ||
                p1.pokemon.sprites.front_default
              }
              alt={p1.pokemon.name}
            />
            <h3>{p1.pokemon.name} (#{p1.pokemon.id})</h3>
            <div>{renderTypes(p1.pokemon.types)}</div>
            <ul>{renderAbilities(p1.pokemon.abilities)}</ul>
            <div>{p1.species?.genera.find(g => g.language.name === 'en')?.genus}</div>
            <p>{p1.species?.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text}</p>
            <div>{renderEvolution(p1.evolution)}</div>
          </div>

          <div className="pokemon-column">
            <img
              src={
                p2.pokemon.sprites?.other["official-artwork"].front_default ||
                p2.pokemon.sprites.front_default
              }
              alt={p2.pokemon.name}
            />
            <h3>{p2.pokemon.name} (#{p2.pokemon.id})</h3>
            <div>{renderTypes(p2.pokemon.types)}</div>
            <ul>{renderAbilities(p2.pokemon.abilities)}</ul>
            <div>{p2.species?.genera.find(g => g.language.name === 'en')?.genus}</div>
            <p>{p2.species?.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text}</p>
            <div>{renderEvolution(p2.evolution)}</div>
          </div>

          <div className="comparison-stats">
            <h3>Stats Comparison</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>{p1.pokemon.name}</th>
                  <th>Diff</th>
                  <th>{p2.pokemon.name}</th>
                </tr>
              </thead>
              <tbody>
                {renderStatComparison()}
                <tr className="total-row">
                  <td>Total</td>
                  <td>{getStatTotal(p1.pokemon)}</td>
                  <td>
                    {getStatTotal(p1.pokemon) - getStatTotal(p2.pokemon)}
                  </td>
                  <td>{getStatTotal(p2.pokemon)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePokemon;