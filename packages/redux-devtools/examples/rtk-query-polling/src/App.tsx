import * as React from 'react';
import { Pokemon } from './Pokemon';
import { PokemonName, POKEMON_NAMES } from './pokemon.data';
import './styles.css';

const getRandomPokemonName = () =>
  POKEMON_NAMES[Math.floor(Math.random() * POKEMON_NAMES.length)];

export default function App() {
  const [pokemon, setPokemon] = React.useState<PokemonName[]>(['bulbasaur']);

  return (
    <div className="App">
      <div>
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

      {pokemon.map((name, index) => (
        <Pokemon key={index} name={name} />
      ))}
    </div>
  );
}
