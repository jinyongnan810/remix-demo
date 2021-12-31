import {
  ErrorBoundaryComponent,
  Form,
  Link,
  redirect,
  json,
  useActionData,
} from "remix";
import type { ActionFunction } from "remix";
import { db } from "~/utils/db.server";

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

export const action: ActionFunction = async ({ request }) => {
  // this runs at server
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

  const post = await db.post.create({ data: { title: title!, body: body! } });
  return redirect(`/posts/${post.id}`);
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

const New = () => {
  const actionData = useActionData<ValidationError | undefined>();
  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
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
            defaultValue={actionData?.fields?.title}
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
            defaultValue={actionData?.fields?.body}
          />
          <div className="error">
            {actionData?.fieldErrors?.body && (
              <p>{actionData?.fieldErrors?.body}</p>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-block">
          Add Post
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
        <Link to="/posts/new" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <p>{error.message}</p>
    </>
  );
};

export default New;
