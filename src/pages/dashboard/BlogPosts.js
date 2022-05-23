import orderBy from 'lodash/orderBy';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
// @mui
import { Grid, Button, Container, Stack } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { SkeletonPostItem } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../sections/@dashboard/blog';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from 'src/config';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};


export default function BlogPosts() {

  const { enqueueSnackbar } = useSnackbar();

const handleDelete = async (id) => {
  const growerDoc = doc(db, "gallery", id)
  await deleteDoc(growerDoc)
  window.location.reload(false)
  enqueueSnackbar('Post Deleted!');

}
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const [posts, setPosts] = useState([]);

  const [filters, setFilters] = useState('latest');

  const sortedPosts = applySort(posts, filters);

  const growersCollectionRef = collection(db, "gallery");


  

  const getAllPosts = useCallback(async () => {
    const data = await getDocs(growersCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [isMountedRef]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleChangeSort = (value) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Page title="Gallery: Posts">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Gallery"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Gallery', href: PATH_DASHBOARD.blog.root },
            { name: 'Posts' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.blog.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Post
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch />
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid key={post.id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                <BlogPostCard post={post} index={index} handleDelete={() => handleDelete(post.id)}/>
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Container>
    </Page>
  );
}
