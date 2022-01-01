import { json, redirect, useActionData } from "remix";
import type { ActionFunction } from "remix";
import { db } from "~/utils/db.server";
import {
  comparePassword,
  createUserSession,
  hashPassword,
} from "~/utils/session.server";

const validateUsername = (username?: string) => {
  if (typeof username != "string" || username.length < 3) {
    return "Username should be at least 3 characters long.";
  }
};
const validatePassword = (password?: string) => {
  if (typeof password != "string" || password.length < 6) {
    return "Password should be at least 6 characters long.";
  }
};
const badRequest = (data: any) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  // check empty & length
  if (Object.values(fieldErrors).some((x) => x)) {
    return badRequest({ fieldErrors, fields });
  }

  // login / register (simplified)
  const existUser = await db.user.findUnique({
    where: { username: username! },
    select: { id: true, passwordHash: true },
  });
  if (existUser) {
    // check login
    if (await comparePassword(password!, existUser.passwordHash)) {
      return await createUserSession(existUser.id!, "/posts");
    } else {
      return badRequest({ fields, fieldErrors: { username: "Invalid Token" } });
    }
  } else {
    // register
    const user = await db.user.create({
      data: {
        username: username!,
        passwordHash: await hashPassword(password!),
      },
    });
    return await createUserSession(user.id, "/posts");
  }

  return redirect("/posts");
};
const login = () => {
  const actionData = useActionData();
  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Log In</h1>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
            />
            <div className="error">
              {actionData?.fieldErrors?.username && (
                <p>{actionData?.fieldErrors?.username}</p>
              )}
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />
            <div className="error">
              {actionData?.fieldErrors?.password && (
                <p>{actionData?.fieldErrors?.password}</p>
              )}
            </div>
          </div>
          <button className="btn btn-block" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default login;
