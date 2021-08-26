import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
} from '@chakra-ui/react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { MdBook } from 'react-icons/md';
import React, { useState } from 'react';
import { Post, useAddPostMutation, useGetPostsQuery } from 'services/posts';
import { PostDetail } from './PostDetail';

const AddPost = () => {
  const initialValue = { name: '' };
  const [post, setPost] = useState<Pick<Post, 'name'>>(initialValue);
  const [addPost, { isLoading }] = useAddPostMutation();
  const toast = useToast();

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
      toast({
        title: 'An error occurred',
        description: "We couldn't save your post, try again!",
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex p={'5px 0'} flexDirection="row" flexWrap="wrap" maxWidth={'85%'}>
      <Box flex={'5 0 auto'} padding="0 5px 0 0">
        <FormControl
          flexDirection="column"
          isInvalid={Boolean(post.name.length < 3 && post.name)}
        >
          <FormLabel htmlFor="name">Post name</FormLabel>
          <Input
            id="name"
            name="name"
            placeholder="Enter post name"
            value={post.name}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Box>
        <Button
          mt={8}
          colorScheme="purple"
          isLoading={isLoading}
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
  const history = useHistory();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!posts) {
    return <div>No posts :(</div>;
  }

  return (
    <List spacing={3}>
      {posts.map(({ id, name }) => (
        <ListItem key={id} onClick={() => history.push(`/posts/${id}`)}>
          <ListIcon as={MdBook} color="green.500" /> {name}
        </ListItem>
      ))}
    </List>
  );
};

export const PostsCountStat = () => {
  const { data: posts } = useGetPostsQuery();

  if (!posts) return null;

  return (
    <Stat>
      <StatLabel>Active Posts</StatLabel>
      <StatNumber>{posts?.length}</StatNumber>
    </Stat>
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
      <Divider />
      <AddPost />
      <Divider />
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
          <Switch>
            <Route path="/posts/:id" component={PostDetail} />
            <Route>
              <Center h="200px">
                <Heading size="md">Select a post to edit!</Heading>
              </Center>
            </Route>
          </Switch>
        </Box>
      </Flex>
    </Box>
  );
};

export default PostsManager;
