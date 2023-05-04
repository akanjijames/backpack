import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import { applyMiddleware } from "graphql-middleware";
import { allow, shield } from "graphql-shield";
import { join } from "path";

import {
  userQueryResolver,
  userTypeResolvers,
  walletQueryResolver,
  walletTypeResolvers,
} from "./resolvers";
import { authorized } from "./rules";
import type { QueryResolvers, Resolvers } from "./types";

/**
 * Root `Query` object resolver.
 */
const queryResolvers: QueryResolvers = {
  user: userQueryResolver,
  wallet: walletQueryResolver,
};

/**
 * Schema root and type-level resolvers.
 */
const resolvers: Resolvers = {
  Query: queryResolvers,
  User: userTypeResolvers,
  Wallet: walletTypeResolvers,
};

/**
 * Permissions map for Shield rule applications on operations and types.
 */
const permissions = shield(
  {
    Query: {
      user: authorized,
    },
    User: authorized,
  },
  { fallbackRule: allow }
);

/**
 * Built schema to be executed on the Apollo server.
 * @export
 */
export const schema = applyMiddleware(
  makeExecutableSchema({
    resolvers,
    typeDefs: readFileSync(join(__dirname, "schema.graphql"), "utf-8"), // Path resolution for the built distribution to schema file
  }),
  permissions
);