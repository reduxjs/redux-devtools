import * as React from 'react';
import { Pokemon } from './Pokemon';
import { PokemonName, POKEMON_NAMES } from './pokemon.data';
import './styles.css';

const getRandomPokemonName = () =>
  POKEMON_NAMES[Math.floor(Math.random() * POKEMON_NAMES.length)];

export default function App() {
  const [pokemon, setPokemon] = React.useState<PokemonName[]>(['bulbasaur']);

  return (
    <article>
      <h1>RTK Query inspector monitor demo</h1>
      <section className="App">
        <h2>Pokemon polling demo</h2>
        <div className="demo-toolbar">
          <button
            onClick={() =>
              setPokemon((prev) => [...prev, getRandomPokemonName()])
            }
          >
            Add random pokemon
          </button>
          <button onClick={() => setPokemon((prev) => [...prev, 'bulbasaur'])}>
            Add bulbasaur
          </button>
        </div>

        <div className="pokemon-list">
          {pokemon.map((name, index) => (
            <Pokemon key={index} name={name} />
          ))}
        </div>
      </section>
      <section>
        <h2>Dock controls</h2>
        <pre>
          <code>
            {`toggleVisibilityKey="ctrl-h"\nchangePositionKey="ctrl-q"`}
          </code>
        </pre>
      </section>
      <footer>
        <p>
          <a href="https://github.com/FaberVitale/redux-devtools/tree/feat/rtk-query-monitor/packages/redux-devtools-rtk-query-inspector-monitor/demo">
            demo source
          </a>
        </p>
        <p>
          <a href="https://github.com/FaberVitale/redux-devtools/tree/feat/rtk-query-monitor/packages/redux-devtools-rtk-query-inspector-monitor">
            @redux-devtools/rtk-query-inspector-monitor source
          </a>
        </p>
      </footer>
    </article>
  );
}
