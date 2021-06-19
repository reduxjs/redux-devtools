import PokemonView from 'features/pokemon/PokemonView';
import PostsView from 'features/posts/PostsView';
import { Flex, Heading } from '@chakra-ui/react';
import { Link, UnorderedList, ListItem } from '@chakra-ui/react';
import { Code } from '@chakra-ui/react';
import * as React from 'react';
import './styles.css';

export function App() {
  return (
    <article>
      <Heading as="h1">RTK Query inspector monitor demo</Heading>
      <PokemonView />
      <PostsView />
      <Flex p="2" as="section" flexWrap="nowrap" flexDirection="column">
        <Heading as="h2">Dock controls</Heading>
        <pre>
          <Code>
            {`toggleVisibilityKey="ctrl-h"\nchangePositionKey="ctrl-q"`}
          </Code>
        </pre>
      </Flex>
      <Flex p="2" as="footer">
        <UnorderedList>
          <ListItem>
            <Link
              className="link"
              isExternal
              href="https://github.com/FaberVitale/redux-devtools/tree/feat/rtk-query-monitor/packages/redux-devtools-rtk-query-inspector-monitor/demo"
            >
              demo source
            </Link>
          </ListItem>
          <ListItem>
            <Link
              className="link"
              isExternal
              href="https://github.com/FaberVitale/redux-devtools/tree/feat/rtk-query-monitor/packages/redux-devtools-rtk-query-inspector-monitor"
            >
              @redux-devtools/rtk-query-inspector-monitor source
            </Link>
          </ListItem>
          <ListItem>
            <Link
              className="link"
              isExternal
              href="https://github.com/reduxjs/redux-toolkit/tree/master/examples/query/react/polling"
            >
              polling example
            </Link>
          </ListItem>
          <ListItem>
            <Link
              className="link"
              isExternal
              href="https://github.com/reduxjs/redux-toolkit/tree/master/examples/query/react/mutations"
            >
              mutations example
            </Link>
          </ListItem>
        </UnorderedList>
      </Flex>
    </article>
  );
}
