import {RegexCheck} from "../client/js/validDestination.js";
test('Valid Destination Name', () => {
    expect(RegexCheck("India")).toBe(true);
});

test('Invalid URL', () => {
    expect(RegexCheck("z0rich")).toBe(false);
});
