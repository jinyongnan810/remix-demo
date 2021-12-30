import { Link, useLoaderData } from "remix";

// this runs at server side
export const loader = () => {
  const data = {
    posts: [
      { id: "1", title: "title1", body: "post1" },
      { id: "2", title: "title2", body: "post2" },
      { id: "3", title: "title3", body: "post3" },
    ],
  };
  return data;
};

type Post = {
  id: string;
  title: string;
  body: string;
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
              <Link to={post.id}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default PostItems;
