import React, { useState } from 'react';
import { Button, createListCollection, Portal, Select } from '@chakra-ui/react';
import { useGetPokemonByNameQuery } from '../../services/pokemon';
import type { PokemonName } from '../../pokemon.data';

const intervalOptions = createListCollection({
  items: [
    { label: 'Off', value: '0' },
    { label: '3s', value: '3000' },
    { label: '5s', value: '5000' },
    { label: '10s', value: '10000' },
    { label: '1m', value: '60000' },
  ],
});

export function Pokemon({ name }: { name: PokemonName }) {
  const [pollingInterval, setPollingInterval] = useState(60000);

  const { data, error, isLoading, isFetching, refetch } =
    useGetPokemonByNameQuery(name, {
      pollingInterval,
    });

  return (
    <div
      className="pokemon"
      style={{
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
            <Select.Root
              collection={intervalOptions}
              value={[pollingInterval.toString()]}
              onValueChange={({ value }) =>
                setPollingInterval(Number(value[0]))
              }
            >
              <Select.HiddenSelect />
              <Select.Label>Polling interval</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Polling interval" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {intervalOptions.items.map((intervalOption) => (
                      <Select.Item
                        item={intervalOption}
                        key={intervalOption.value}
                      >
                        {intervalOption.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </div>
          <div>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={refetch}
              disabled={isFetching}
            >
              {isFetching ? 'Loading' : 'Manually refetch'}
            </Button>
          </div>
        </>
      ) : (
        'No Data'
      )}
    </div>
  );
}
