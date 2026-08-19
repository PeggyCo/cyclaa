// Metro config for a monorepo (npm workspaces): watch the repo root so
// changes to packages/shared are picked up, and resolve node_modules from
// both this app and the hoisted workspace root.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// Avoid resolving a second copy of React from the workspace root if one
// exists there — keeps hooks working across the monorepo boundary.
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
