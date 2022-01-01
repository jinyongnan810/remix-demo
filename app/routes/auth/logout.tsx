import { ActionFunction } from "remix";
import { endUserSession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  return await endUserSession(request, "/");
};
