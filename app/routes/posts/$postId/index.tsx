import {
  ErrorBoundaryComponent,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "remix";
import type { LoaderFunction, ActionFunction } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  // check user
  const user = await getUser(request);
  if (!user) return redirect("/auth/login");
  // check post
  const postId = params["postId"];
  const formData = await request.formData();
  if (formData.get("_method") == "delete") {
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    if (post?.userId !== user.id) throw new Error("Not Authorized!");
    await db.post.delete({
      where: {
        id: postId,
      },
    });
    return redirect("/posts");
  }
  return null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  // check user
  const user = await getUser(request);
  if (!user) return redirect("/auth/login");
  // check post
  const postId = params["postId"];
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { id: true, title: true, body: true, userId: true },
  });
  if (!post) throw new Error("Post not found.");
  const data = {
    post,
    user,
  };
  return data;
};

type Post = {
  id: string;
  title: string;
  body: string;
  userId: string;
};
type User = {
  id: string;
  username: string;
};

const PostItem = () => {
  const { post, user } = useLoaderData<{ post: Post; user?: User }>();
  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">{post.body}</div>
      <div className="page-footer">
        <Form method="post">
          <input type="hidden" name="_method" value="delete" />
          {user && user.id === post.userId && (
            <Link to={`/posts/${post.id}/edit`} className="btn btn-update">
              update
            </Link>
          )}
          {user && user.id === post.userId && (
            <button type="submit" className="btn btn-delete">
              delete
            </button>
          )}
        </Form>
      </div>
    </div>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <>
      <div className="page-header">
        <h1>Error</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <p>{error.message}</p>
    </>
  );
};

export default PostItem;
