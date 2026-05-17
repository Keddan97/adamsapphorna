const fs = require('fs');
const path = require('path');

// Extract the shuffle function directly from the HTML file
const htmlPath = path.resolve(__dirname, 'rymdinvaders.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

let shuffle;
const match = htmlContent.match(/function shuffle\([^)]*\)\s*{[^}]*}/);
if (match) {
  // Use Function constructor to safely evaluate the function string
  shuffle = new Function(`return ${match[0]}`)();
} else {
  throw new Error("Could not find shuffle function in rymdinvaders.html");
}

describe('shuffle function', () => {
  it('should return a new array instance (pure function)', () => {
    const orig = [1, 2, 3, 4, 5];
    const result = shuffle(orig);
    expect(result).not.toBe(orig);
  });

  it('should return an array of the exact same length', () => {
    const orig = [1, 2, 3, 4, 5];
    const result = shuffle(orig);
    expect(result).toHaveLength(orig.length);
  });

  it('should contain all the original elements', () => {
    const orig = [1, 2, 3, 4, 5];
    const result = shuffle(orig);
    // Sort both arrays and compare to ensure exact same elements
    expect([...result].sort()).toEqual([...orig].sort());
  });

  it('should handle an empty array', () => {
    const result = shuffle([]);
    expect(result).toEqual([]);
  });

  it('should handle an array with a single element', () => {
    const result = shuffle([42]);
    expect(result).toEqual([42]);
  });

  it('should not add or remove any elements', () => {
    const orig = ['a', 'b', 'c', 'd'];
    const result = shuffle(orig);
    const hasAll = orig.every(val => result.includes(val));
    const hasOnly = result.every(val => orig.includes(val));

    expect(hasAll).toBe(true);
    expect(hasOnly).toBe(true);
  });

  it('should shuffle arrays with complex objects', () => {
    const orig = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = shuffle(orig);

    expect(result).toHaveLength(orig.length);
    expect(result).toContain(orig[0]);
    expect(result).toContain(orig[1]);
    expect(result).toContain(orig[2]);
  });
});
