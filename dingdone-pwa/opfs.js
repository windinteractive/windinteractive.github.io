// Video messages carry files picked in configuration.html. They are too big for
// localStorage, so they live in the origin private file system: same origin,
// so the chat reads back what the configuration screen wrote.
//
// A message stores the name as 'opfs:<name>'; anything else is an ordinary URL.
export const OPFS = 'opfs:';

const DIR = 'chat';

const dir = () => navigator.storage.getDirectory()
  .then(root => root.getDirectoryHandle(DIR, { create: true }));

export const isOpfs = value => typeof value === 'string' && value.startsWith(OPFS);
export const opfsName = value => value.slice(OPFS.length);

// Returns the reference to store on the message.
export async function saveFile(name, file) {
  const handle = await (await dir()).getFileHandle(name, { create: true });
  const writable = await handle.createWritable();
  await writable.write(file);
  await writable.close();
  return OPFS + name;
}

// A blob URL the caller owns — revoke it when the element goes away.
export async function fileUrl(name) {
  const handle = await (await dir()).getFileHandle(name);
  return URL.createObjectURL(await handle.getFile());
}

// Missing files are already the wanted state, so a failed removal is not an error.
export async function removeFile(name) {
  try {
    await (await dir()).removeEntry(name);
  } catch (e) { /* never written, or already gone */ }
}
