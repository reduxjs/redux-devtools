import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { PostsManager } from 'features/posts/PostsManager';
import { Box, Heading } from '@chakra-ui/react';

function PostsView() {
  return (
    <Box as="section" p="2">
      <Heading as="h2">Posts Demo</Heading>
      <Switch>
        <Route path="/" component={PostsManager} />
      </Switch>
    </Box>
  );
}

export default PostsView;
