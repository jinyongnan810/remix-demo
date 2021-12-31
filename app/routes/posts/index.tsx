import { Link, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

// this runs at server side
export const loader = async () => {
  const posts = await db.post.findMany({
    take: 20,
    select: { id: true, title: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  const data = {
    posts: posts,
  };
  return data;
};

type Post = {
  id: string;
  title: string;
  updatedAt: string;
};

type PostsPageData = {
  posts: Post[];
};

const PostItems = () => {
  const { posts } = useLoaderData<PostsPageData>();
  return (
    <div>
      <>
        <div className="page-header">
          <h1>Posts</h1>
          <Link to="new" className="btn">
            New Post
          </Link>
        </div>
        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={post.id}>
                <h3>{post.title}</h3>
                {new Date(post.updatedAt).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default PostItems;
