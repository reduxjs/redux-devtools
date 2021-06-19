import * as React from 'react';
import { Pokemon } from './Pokemon';
import { PokemonName, POKEMON_NAMES } from '../../pokemon.data';
import { Flex, Heading, Button } from '@chakra-ui/react';

const getRandomPokemonName = () =>
  POKEMON_NAMES[Math.floor(Math.random() * POKEMON_NAMES.length)];

export default function PokemonView() {
  const [pokemon, setPokemon] = React.useState<PokemonName[]>(['bulbasaur']);

  return (
    <Flex p="2" as="section" flexWrap="nowrap" flexDirection="column">
      <Heading as="h2">Pokemon polling demo</Heading>
      <div className="demo-toolbar">
        <Button
          onClick={() =>
            setPokemon((prev) => [...prev, getRandomPokemonName()])
          }
        >
          Add random pokemon
        </Button>
        <Button onClick={() => setPokemon((prev) => [...prev, 'bulbasaur'])}>
          Add bulbasaur
        </Button>
      </div>

      <div className="pokemon-list">
        {pokemon.map((name, index) => (
          <Pokemon key={index} name={name} />
        ))}
      </div>
    </Flex>
  );
}
