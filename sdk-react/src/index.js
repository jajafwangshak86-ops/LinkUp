/**
 * linkup-react
 * React hooks for LinkUp smart contracts on Stacks/Bitcoin.
 * Wraps linkup-stacks-sdk with React Query hooks.
 */
const { getStats, isRegistered, getUser, getPost } = require('linkup-stacks-sdk');

module.exports = { getStats, isRegistered, getUser, getPost };
