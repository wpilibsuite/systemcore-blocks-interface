// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */

/**
 * Take the proposed name, and return a legal name.
 * A legal name is:
 * 1. not empty.
 * 2. doesn't collide with other names (case insensitive).
 * 3. Optional: is a valid python identifier.
 */
export function makeLegalName(proposedName: string, otherNames: string[], mustBeValidPythonIdentifier: boolean): string {
  const otherNamesLowerCase = otherNames.map(n => n.toLowerCase());

  // Strip leading and trailing whitespace.
  let name = proposedName.trim();

  // Make the name non-empty.
  name = name || 'unnamed';

  if (mustBeValidPythonIdentifier) {
    if (!name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      let identifier = '';
      const firstChar = name[0];
      if (/[a-zA-Z_]/.test(firstChar)) {
        identifier += firstChar;
      } else if (/[a-zA-Z0-9_]/.test(firstChar)) {
        // If the first character would be valid as the second charactor, insert an underscore.
        identifier += '_' + firstChar;
      } else {
        identifier += '_';
      }
      for (let i = 1; i < name.length; i++) {
        const char = name[i];
        if (/[a-zA-Z0-9_]/.test(char)) {
          identifier += char;
        } else {
          identifier += '_';
        }
      }
      name = identifier;
    }
  }

  while (otherNamesLowerCase.includes(name.toLowerCase())) {
    // Collision with another name.
    const r = name.match(/^(.*?)_(\d+)$/);
    if (!r) {
      name += '_1';
    } else {
      name = r[1] + '_' + (parseInt(r[2]) + 1);
    }
  }
  return name;
}
