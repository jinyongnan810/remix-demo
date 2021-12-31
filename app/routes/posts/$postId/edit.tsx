import {
  ErrorBoundaryComponent,
  Form,
  Link,
  redirect,
  useLoaderData,
  useActionData,
  json,
} from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { useState } from "react";

const validateTitle = (title?: string) => {
  if (typeof title != "string" || title.length < 3) {
    return "Title should be at least 3 characters long.";
  }
};
const validateBody = (body?: string) => {
  if (typeof body != "string" || body.length < 10) {
    return "Body should be at least 10 characters long.";
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  // this runs at server
  const postId = params["postId"];
  const form = await request.formData();
  const title = form.get("title")?.toString();
  const body = form.get("body")?.toString();
  const fields = { title: title, body: body };
  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };
  console.log(JSON.stringify({ fields, fieldErrors }));
  if (Object.values(fieldErrors).some((x) => x)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }
  const post = await db.post.update({
    where: { id: postId },
    data: { title: title!, body: body! },
  });
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

type ValidationError = {
  fields: {
    title: string;
    body: string;
  };
  fieldErrors: {
    title?: string;
    body?: string;
  };
};

const Edit = () => {
  const { post } = useLoaderData<{ post: Post }>();
  const actionData = useActionData<ValidationError | undefined>();
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
            value={actionData?.fields?.title || title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="error">
            {actionData?.fieldErrors?.title && (
              <p>{actionData?.fieldErrors?.title}</p>
            )}
          </div>
        </div>
        <div className="form-control">
          <label htmlFor="body">Content</label>
          <textarea
            name="body"
            id="body"
            value={actionData?.fields?.body || body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="error">
            {actionData?.fieldErrors?.body && (
              <p>{actionData?.fieldErrors?.body}</p>
            )}
          </div>
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
