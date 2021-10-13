export interface Identifiable {
  id: Identifier;
}

export type Identifier = string;

export const createIdentifier = (): Identifier =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character: string): string => {
      const random = (Math.random() * 16) | 0;
      return (character === "x" ? random : (random & 0x3) | 0x8).toString(16);
    }
  );
