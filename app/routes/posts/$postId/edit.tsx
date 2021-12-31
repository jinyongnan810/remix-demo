import {
  ErrorBoundaryComponent,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { useState } from "react";

export const action: ActionFunction = async ({ request, params }) => {
  // this runs at server
  const postId = params["postId"];
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");
  if (!(title && body)) return;
  const fields = { title: title.toString(), body: body.toString() };
  const post = await db.post.update({ where: { id: postId }, data: fields });
  return redirect(`/posts/${post.id}`);
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

const Edit = () => {
  const { post } = useLoaderData<{ post: Post }>();
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  return (
    <>
      <div className="page-header">
        <h1>Edting Post</h1>
        <Link to={`/posts/${post.id}`} className="btn btn-reverse">
          Back
        </Link>
      </div>
      <Form method="post">
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="body">Content</label>
          <textarea
            name="body"
            id="body"
            value={post.body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-block">
          Save Post
        </button>
      </Form>
    </>
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

export default Edit;
