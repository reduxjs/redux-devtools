import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokemonName } from '../pokemon.data';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: ['pokemon'],
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name: PokemonName) => `pokemon/${name}`,
      providesTags: (result, error, name: PokemonName) => [
        { type: 'pokemon' },
        { type: 'pokemon', id: name },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetPokemonByNameQuery } = pokemonApi;
