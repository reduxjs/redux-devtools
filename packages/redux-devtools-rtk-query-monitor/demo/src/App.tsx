import PokemonView from './features/pokemon/PokemonView';
import PostsView from './features/posts/PostsView';
import { Box, Flex, Heading, List } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import { Code } from '@chakra-ui/react';
import * as React from 'react';
import { DevToolsSelector } from './features/DevTools/DevToolsSelector';

export function App() {
  return (
    <main className="rtk-query-demo-app">
      <Heading as="h1" p="2">
        RTK Query inspector monitor demo
      </Heading>
      <PokemonView />
      <PostsView />
      <DevToolsSelector />
      <Flex p="2" as="section" flexWrap="nowrap" flexDirection="column">
        <Heading as="h2">Dock controls</Heading>
        <Box as="pre" p="2" paddingX="4">
          <Code>
            {`toggleVisibilityKey="ctrl-h"\nchangePositionKey="ctrl-q"`}
          </Code>
        </Box>
        <Box as="p" p="2" paddingX="4">
          Drag its border to resize
        </Box>
      </Flex>
      <Flex p="2" as="footer">
        <List.Root p="2">
          <List.Item>
            <Link
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/FaberVitale/redux-devtools/tree/feat/rtk-query-monitor/packages/redux-devtools-rtk-query-monitor/demo"
            >
              demo source
            </Link>
          </List.Item>
          <List.Item>
            <Link
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/FaberVitale/redux-devtools/tree/feat/rtk-query-monitor/packages/redux-devtools-rtk-query-monitor"
            >
              @redux-devtools/rtk-query-monitor source
            </Link>
          </List.Item>
          <List.Item>
            <Link
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/reduxjs/redux-toolkit/tree/master/examples/query/react/polling"
            >
              polling example
            </Link>
          </List.Item>
          <List.Item>
            <Link
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/reduxjs/redux-toolkit/tree/master/examples/query/react/mutations"
            >
              mutations example
            </Link>
          </List.Item>
        </List.Root>
      </Flex>
    </main>
  );
}
