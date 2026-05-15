import { createAccessControl } from "better-auth/plugins";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";

export const ac = createAccessControl({
  ...defaultStatements,
});

export const user = ac.newRole({
  ...userAc.statements,
  user: [...userAc.statements.user, "list"],
});

export const adminRole = ac.newRole(adminAc.statements);
