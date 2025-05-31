import {
  Box,
  Button,
  Center,
  Field,
  Flex,
  FormatNumber,
  Heading,
  Input,
  List,
  Separator,
  Spacer,
  Stat,
} from '@chakra-ui/react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { MdBook } from 'react-icons/md';
import React, { useState } from 'react';
import {
  Post,
  useAddPostMutation,
  useGetPostsQuery,
} from '../../services/posts';
import { PostDetail } from './PostDetail';
import { toaster } from '../../components/ui/toaster';

const AddPost = () => {
  const initialValue = { name: '' };
  const [post, setPost] = useState<Pick<Post, 'name'>>(initialValue);
  const [addPost, { isLoading }] = useAddPostMutation();

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleAddPost = async () => {
    try {
      await addPost(post).unwrap();
      setPost(initialValue);
    } catch {
      toaster.create({
        title: 'An error occurred',
        description: "We couldn't save your post, try again!",
        type: 'error',
        duration: 2000,
        closable: true,
      });
    }
  };

  return (
    <Flex p={'5px 0'} flexDirection="row" flexWrap="wrap" maxWidth={'85%'}>
      <Box flex={'5 0 auto'} padding="0 5px 0 0">
        <Field.Root
          flexDirection="column"
          invalid={Boolean(post.name.length < 3 && post.name)}
        >
          <Field.Label htmlFor="name">Post name</Field.Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter post name"
            value={post.name}
            onChange={handleChange}
          />
        </Field.Root>
      </Box>
      <Box>
        <Button
          mt={8}
          colorScheme="purple"
          loading={isLoading}
          onClick={handleAddPost}
        >
          Add Post
        </Button>
      </Box>
    </Flex>
  );
};

const PostList = () => {
  const { data: posts, isLoading } = useGetPostsQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!posts) {
    return <div>No posts :(</div>;
  }

  return (
    <List.Root gap={3}>
      {posts.map(({ id, name }) => (
        <List.Item key={id} onClick={() => navigate(`/posts/${id}`)}>
          <List.Indicator asChild color="green.500">
            <MdBook />
          </List.Indicator>
          {name}
        </List.Item>
      ))}
    </List.Root>
  );
};

export const PostsCountStat = () => {
  const { data: posts } = useGetPostsQuery();

  if (!posts) return null;

  return (
    <Stat.Root>
      <Stat.Label>Active Posts</Stat.Label>
      <Stat.ValueText>
        <FormatNumber value={posts?.length} />
      </Stat.ValueText>
    </Stat.Root>
  );
};

export const PostsManager = () => {
  return (
    <Box>
      <Flex bg="#011627" p={4} color="white">
        <Box>
          <Heading size="xl">Manage Posts</Heading>
        </Box>
        <Spacer />
        <Box>
          <PostsCountStat />
        </Box>
      </Flex>
      <Separator />
      <AddPost />
      <Separator />
      <Flex wrap="wrap">
        <Box flex={1} borderRight="1px solid #eee">
          <Box p={4} borderBottom="1px solid #eee">
            <Heading size="sm">Posts</Heading>
          </Box>
          <Box p={4}>
            <PostList />
          </Box>
        </Box>
        <Box flex={2}>
          <Routes>
            <Route path="posts/:id" element={<PostDetail />} />
            <Route
              index
              element={
                <Center h="200px">
                  <Heading size="md">Select a post to edit!</Heading>
                </Center>
              }
            />
          </Routes>
        </Box>
      </Flex>
    </Box>
  );
};

export default PostsManager;
