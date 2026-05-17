const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, './buzzer.html'), 'utf8');

let dom;
let document;
let window;

describe('Buzzer.html darken() function', () => {
  beforeEach(() => {
    dom = new JSDOM(html, {
      url: "http://localhost/",
      runScripts: "dangerously",
      beforeParse(window) {
        window.localStorage = {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          clear: jest.fn(),
        };
      }
    });
    document = dom.window.document;
    window = dom.window;
  });

  it('should be a function', () => {
    expect(typeof window.darken).toBe('function');
  });

  it('should darken a color appropriately when factor is 0', () => {
    expect(window.darken('#ffffff', 0)).toBe('rgb(255,255,255)');
  });

  it('should darken a color appropriately when factor is 1', () => {
    expect(window.darken('#ffffff', 1)).toBe('rgb(10,10,15)');
  });

  it('should darken a color appropriately when factor is 0.5', () => {
    expect(window.darken('#ffffff', 0.5)).toBe('rgb(133,133,135)');
  });

  it('should correctly parse the hex and darken #15803d', () => {
    expect(window.darken('#15803d', 0.92)).toBe('rgb(11,19,19)');
  });

  it('should handle short hex codes if applicable or pure black', () => {
    expect(window.darken('#000000', 0.5)).toBe('rgb(5,5,8)');
  });
});
