function authenticateUser ({c}) {
  if (!c) { throw new Error('Missing parameters.'); }

  let credentials;
  try { credentials = atob(c); } catch (ex) { throw new Error('Invalid format.'); }

  const { user, pass } = credentials;
  if (!user || !pass) { throw new Error('Missing credentials.'); }

  const account = getSheetData(env.auth.id, env.auth.users).find(u => u.username === user);
  if (!account || account.password !== pass) { throw new Error('Invalid credentials.'); }

  return btoa(generateUuid());
}
