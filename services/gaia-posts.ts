/**
 * Gaia posts service — store full post content in user's Gaia hub.
 * The on-chain contract stores only the SHA-256 hash + this URL.
 */

const GAIA_HUB = 'https://hub.hiro.so';

/**
 * Write post JSON to Gaia and return the public read URL.
 */
export async function writeGaiaPost(
  ownerAddress: string,
  gaiaToken: string,
  postJson: string,
): Promise<string> {
  const filename = `linkup/posts/${Date.now()}-${Math.random().toString(36).slice(2)}.json`;
  const url = `${GAIA_HUB}/store/${ownerAddress}/${filename}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${gaiaToken}`,
    },
    body: postJson,
  });

  if (!res.ok) throw new Error(`Gaia write failed: ${res.status}`);

  // Return the public read URL
  return `${GAIA_HUB}/read/${ownerAddress}/${filename}`;
}

/**
 * Fetch full post content from Gaia by URL.
 */
export async function fetchGaiaPost(gaiaUrl: string): Promise<{
  content: string;
  images: string[];
  author: string;
  createdAt: number;
}> {
  const res = await fetch(gaiaUrl);
  if (!res.ok) throw new Error(`Gaia fetch failed: ${res.status}`);
  return res.json();
}
