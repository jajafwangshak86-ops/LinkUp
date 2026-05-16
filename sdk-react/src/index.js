/**
 * linkup-react
 * React hooks for LinkUp smart contracts on Stacks/Bitcoin.
 */

const { getStats, isRegistered, getUser, getPost, getAddressByUsername } = require('linkup-stacks-sdk');

/** Fetch global LinkUp stats */
async function useLinkUpStats() {
  return getStats();
}

/** Check if a Stacks address is registered on LinkUp */
async function useIsRegistered(address) {
  return isRegistered(address);
}

/** Get a user profile by address */
async function useUserProfile(address) {
  return getUser(address);
}

/** Get a post by ID */
async function usePost(postId) {
  return getPost(postId);
}

module.exports = { useLinkUpStats, useIsRegistered, useUserProfile, usePost };
