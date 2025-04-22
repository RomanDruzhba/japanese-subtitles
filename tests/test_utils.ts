export function removeChildren(root: HTMLElement): void {
  while (root.lastChild) {
    root.lastChild.remove();
  }
}

export const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
