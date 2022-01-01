import bcrypt from "bcrypt";
import { createCookieSessionStorage, redirect } from "remix";
import { db } from "./db.server";

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "remix-demo-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET!],
    sameSite: "lax",
    path: "/",
    maxAge: 3600 * 24 * 7,
    httpOnly: true,
  },
});
export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export const endUserSession = async (request: Request, redirectTo: string) => {
  const session = await getUserSession(request);
  const res = await sessionStorage.destroySession(session);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": res,
    },
  });
};

export const getUserSession = async (request: Request) => {
  return sessionStorage.getSession(request.headers.get("Cookie"));
};

export const getUser = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId != "string") return null;
  try {
    return await db.user.findUnique({
      where: { id: userId! },
      select: { id: true, username: true },
    });
  } catch (error) {
    return null;
  }
};
