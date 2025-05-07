export const normalize = (str: string) =>
  str.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();