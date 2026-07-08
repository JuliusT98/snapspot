export function formatSnapDate(isoString) {
  return new Date(isoString).toLocaleString('de-DE', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
