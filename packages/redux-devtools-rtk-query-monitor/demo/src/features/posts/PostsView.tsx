import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PostsManager } from '../../features/posts/PostsManager';
import { Box, Heading } from '@chakra-ui/react';

function PostsView() {
  return (
    <Box as="section" p="2">
      <Heading as="h2">Posts Demo</Heading>
      <Routes>
        <Route path="/*" element={<PostsManager />} />
      </Routes>
    </Box>
  );
}

export default PostsView;
