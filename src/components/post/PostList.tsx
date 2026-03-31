import { useState, useEffect } from 'react';
import type { Post } from '../../types';
import { PostCard } from './PostCard';
import { Pagination } from '../common/Pagination';
import { Loading } from '../common/Loading';
import { Empty } from '../common/Empty';

interface Props {
  posts: Post[];
  loading: boolean;
  pageSize?: number;
}

export function PostList({ posts, loading, pageSize = 10 }: Props) {
  const [page, setPage] = useState(1);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPage(1);
  }, [posts]);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    setDisplayedPosts(posts.slice(start, start + pageSize));
  }, [posts, page, pageSize]);

  if (loading) return <Loading />;
  if (posts.length === 0) return <Empty message="暂无文章" />;

  return (
    <div>
      <div>
        {displayedPosts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <Pagination
        current={page}
        total={posts.length}
        pageSize={pageSize}
        onPage={setPage}
      />
    </div>
  );
}
