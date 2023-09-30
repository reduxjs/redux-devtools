import * as React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReduxDevTools } from './devtools.mocks';
import { BaseQueryJestMockFunction, setupStore } from './rtk-query.mocks';

function Providers({
  store,
  children,
}: {
  store: ReturnType<typeof setupStore>['store'];
  children?: React.ComponentProps<typeof Provider>['children'];
}) {
  const AnyProvider = Provider as any;

  return (
    <div id="app-root">
      <AnyProvider store={store}>
        {children}
        <ReduxDevTools />
      </AnyProvider>
    </div>
  );
}

describe('rtk-query-monitor standalone integration', () => {
  // Hushes symbol.observable warning
  // @see https://github.com/reduxjs/redux-devtools/issues/1002
  jest.spyOn(console, 'warn');
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (console.warn as jest.Mock<void>).mockImplementation(() => {});

  const dataPanelDomId = '#rtk-query-monitor-tab-panel-0';

  const childrenTextContent = 'Renders children';
  const fetchBaseQueryMock: BaseQueryJestMockFunction<Record<string, unknown>> =
    jest.fn((...fetchArgs) =>
      Promise.resolve({
        data: {
          name: fetchArgs[0],
        },
      }),
    );
  const { store, pokemonApi } = setupStore(fetchBaseQueryMock, ReduxDevTools);

  beforeAll(() => {
    // let's populate api
    (store.dispatch as any)(
      pokemonApi.endpoints.getPokemonByName.initiate('bulbasaur'),
    );
  });

  beforeEach(() => {
    fetchBaseQueryMock.mockClear();
  });

  afterAll(() => {
    (console.warn as jest.Mock<void>).mockRestore();
  });

  it('renders on a standalone app without crashing', () => {
    const { container } = render(
      <Providers store={store}>
        <div data-testid="children">{childrenTextContent}</div>
      </Providers>,
    );

    expect(screen.getByTestId('children').textContent).toBe(
      childrenTextContent,
    );

    expect(
      screen
        .getByRole('tab', { name: /actions/i })
        ?.textContent?.toLowerCase()
        .trim(),
    ).toBe('actions');
    expect(
      screen
        .getByRole('tab', { name: /data/i })
        ?.textContent?.toLowerCase()
        .trim(),
    ).toBe('data');
    expect(
      screen
        .getByRole('tab', { name: /api/i })
        ?.textContent?.toLowerCase()
        .trim(),
    ).toBe('api');
    expect(
      container.querySelector(
        'form[id="rtk-query-monitor-query-selection-form"]',
      ),
    ).toBeDefined();
  });

  it('displays query data tab content', async () => {
    // `Promise.resolve()` hushes `@typescript-eslint/await-thenable`
    await Promise.resolve(
      store.dispatch(pokemonApi.util.getRunningQueriesThunk() as any),
    );

    const { container } = render(
      <Providers store={store}>
        <div data-testid="children">{childrenTextContent}</div>
      </Providers>,
    );

    // We need to select the query & the correct tab
    fireEvent.click(screen.getByRole('tab', { name: /data/i }));
    fireEvent.click(screen.getByText(/bulbasaur/i));

    await waitFor(() =>
      expect(container.querySelector(dataPanelDomId)).not.toBeNull(),
    );

    expect(container.querySelector(dataPanelDomId)?.textContent).toMatch(
      /name\W+pokemon\/bulbasaur/i,
    );
  });
});
