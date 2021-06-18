import * as React from 'react';
import { useGetPokemonByNameQuery } from './services/pokemon';
import type { PokemonName } from './pokemon.data';

const intervalOptions = [
  { label: 'Off', value: 0 },
  { label: '3s', value: 3000 },
  { label: '5s', value: 5000 },
  { label: '10s', value: 10000 },
  { label: '1m', value: 60000 },
];

const getRandomIntervalValue = () =>
  intervalOptions[Math.floor(Math.random() * intervalOptions.length)].value;

export function Pokemon({ name }: { name: PokemonName }) {
  const [pollingInterval, setPollingInterval] = React.useState(
    getRandomIntervalValue()
  );

  const { data, error, isLoading, isFetching, refetch } =
    useGetPokemonByNameQuery(name, {
      pollingInterval,
    });

  return (
    <div
      style={{
        float: 'left',
        textAlign: 'center',
        ...(isFetching ? { background: '#e6ffe8' } : {}),
      }}
    >
      {error ? (
        <>Oh no, there was an error loading {name}</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <h3>{data.species.name}</h3>
          <div style={{ minWidth: 96, minHeight: 96 }}>
            <img
              src={data.sprites.front_shiny}
              alt={data.species.name}
              style={{ ...(isFetching ? { opacity: 0.3 } : {}) }}
            />
          </div>
          <div>
            <label style={{ display: 'block' }}>Polling interval</label>
            <select
              value={pollingInterval}
              onChange={({ target: { value } }) =>
                setPollingInterval(Number(value))
              }
            >
              {intervalOptions.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button onClick={refetch} disabled={isFetching}>
              {isFetching ? 'Loading' : 'Manually refetch'}
            </button>
          </div>
        </>
      ) : (
        'No Data'
      )}
    </div>
  );
}
