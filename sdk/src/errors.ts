/** LinkUp contract error codes */
export const ERRORS = {
  DAILY_LIMIT_EXCEEDED: 100,
  ZERO_AMOUNT: 101,
  SELF_TRANSFER: 102,
  POST_NOT_FOUND: 200,
  ALREADY_LIKED: 201,
  ZERO_TIP: 202,
  SELF_TIP: 203,
  NOT_AUTHOR: 204,
  CONTENT_EMPTY: 205,
  OVERFLOW: 206,
  ALREADY_REGISTERED: 300,
  NOT_REGISTERED: 301,
  USERNAME_TAKEN: 302,
  USERNAME_EMPTY: 303,
  NOT_OWNER: 304,
} as const;

export function parseContractError(code: number): string {
  const entry = Object.entries(ERRORS).find(([, v]) => v === code);
  return entry ? entry[0].replace(/_/g, ' ') : `Unknown error (${code})`;
}
