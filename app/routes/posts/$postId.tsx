import {
  ErrorBoundaryComponent,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "remix";
import type { LoaderFunction, ActionFunction } from "remix";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const postId = params["postId"];
  const formData = await request.formData();
  if (formData.get("_method") == "delete") {
    await db.post.delete({
      where: {
        id: postId,
      },
    });
    return redirect("/posts");
  }
  return null;
};

export const loader: LoaderFunction = async ({ params }) => {
  const postId = params["postId"];
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { id: true, title: true, body: true },
  });
  if (!post) throw new Error("Post not found.");
  const data = {
    post,
  };
  return data;
};

type Post = {
  id: string;
  title: string;
  body: string;
};

const PostItem = () => {
  const { post } = useLoaderData<{ post: Post }>();
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
          <button type="submit" className="btn btn-delete">
            delete
          </button>
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
