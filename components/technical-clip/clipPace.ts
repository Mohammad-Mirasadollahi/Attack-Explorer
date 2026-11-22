/**
 * Seconds at the 1x control.
 * Travel only relocates something the viewer already knows.
 * Teach is the change that carries the claim, and it has to be readable.
 * Repeat is the same verb on the next sibling.
 * Hold is how long the result sits before the next claim.
 */
export const clipPace = {
  travel: 1.2,
  teach: 1.8,
  repeat: 1.05,
  hold: 1.3,
  end: 2.2,
} as const;
