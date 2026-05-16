const GAIA_HUB = 'https://hub.hiro.so';

/** Build a Gaia read URL for a given owner and path */
export function gaiaReadUrl(ownerAddress: string, path: string): string {
  return `${GAIA_HUB}/read/${ownerAddress}/${path}`;
}

/** Build a Gaia store URL for a given owner and path */
export function gaiaStoreUrl(ownerAddress: string, path: string): string {
  return `${GAIA_HUB}/store/${ownerAddress}/${path}`;
}

/** Build the profile Gaia URL for a user */
export function profileGaiaUrl(ownerAddress: string): string {
  return gaiaReadUrl(ownerAddress, 'linkup/profile.json');
}

/** Build a post Gaia URL */
export function postGaiaUrl(ownerAddress: string, postId: string): string {
  return gaiaReadUrl(ownerAddress, `linkup/posts/${postId}.json`);
}
