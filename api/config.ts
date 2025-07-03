/**
 * List of allowed GitHub repository owners/organizations
 * Only repositories from these owners will be served
 */
export const allowedOwners = [
  'techwithanirudh',
  // Add more allowed owners here
  // 'another-owner',
  // 'some-organization',
];

/**
 * Headers to strip from the proxied response
 */
export const headers = [
  'content-encoding',
  'content-disposition',
  'transfer-encoding'
];