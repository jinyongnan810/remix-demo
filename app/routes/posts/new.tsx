import { ErrorBoundaryComponent, Form, Link, redirect } from "remix";
import type { ActionFunction } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");
  // TODO: submit to database
  throw new Error("Not Implemented.");
  return redirect("/posts");
};

const New = () => {
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
          <input type="text" name="title" id="title" />
        </div>
        <div className="form-control">
          <label htmlFor="body">Content</label>
          <textarea name="body" id="body" />
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
