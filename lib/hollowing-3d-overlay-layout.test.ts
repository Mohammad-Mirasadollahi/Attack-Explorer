import test from 'node:test';
import assert from 'node:assert/strict';
import { computeFloatingCalloutLayout } from './hollowing-3d-overlay-layout';

test('keeps well-separated Bank Truck and Hidden Intruder labels near projected anchors', () => {
  const layout = computeFloatingCalloutLayout({
    viewportWidth: 1200,
    viewportHeight: 720,
    bankTruck: { x: 680, y: 260, visible: true },
    hiddenIntruder: { x: 260, y: 410, visible: true },
  });

  assert.equal(layout.bankTruck.visible, true);
  assert.equal(layout.hiddenIntruder.visible, true);
  assert.equal(layout.bankTruck.x, 680);
  assert.equal(layout.bankTruck.y, 260);
  assert.equal(layout.hiddenIntruder.x, 260);
  assert.equal(layout.hiddenIntruder.y, 410);
  assert.equal(layout.bankTruck.clamped, false);
  assert.equal(layout.hiddenIntruder.clamped, false);
});

test('separates overlapping labels cleanly when Hidden Intruder rides inside Bank Truck', () => {
  const layout = computeFloatingCalloutLayout({
    viewportWidth: 1200,
    viewportHeight: 720,
    bankTruck: { x: 640, y: 310, visible: true },
    hiddenIntruder: { x: 620, y: 325, visible: true },
  });

  const dx = Math.abs(layout.bankTruck.x - layout.hiddenIntruder.x);
  const dy = Math.abs(layout.bankTruck.y - layout.hiddenIntruder.y);
  assert.ok(
    dx >= 130 || dy >= 58,
    `Expected separated labels without overlap, got dx=${dx}, dy=${dy}`
  );
});

test('clamps labels away from Top-Left Storyboard Caption and Bottom Control Dock', () => {
  const layout = computeFloatingCalloutLayout({
    viewportWidth: 1200,
    viewportHeight: 720,
    bankTruck: { x: 140, y: 90, visible: true },
    hiddenIntruder: { x: 600, y: 690, visible: true },
  });

  // Top-left label must clear the caption card
  assert.ok(
    layout.bankTruck.x >= 490 || layout.bankTruck.y >= 238,
    `Expected top-left caption avoidance, got (${layout.bankTruck.x}, ${layout.bankTruck.y})`
  );
  // Bottom label must clear the bottom control dock
  assert.ok(
    layout.hiddenIntruder.y <= 570,
    `Expected bottom dock clearance, got y=${layout.hiddenIntruder.y}`
  );
});

test('respects behind-camera invisible flag cleanly', () => {
  const layout = computeFloatingCalloutLayout({
    viewportWidth: 1200,
    viewportHeight: 720,
    bankTruck: { x: 500, y: 300, visible: false },
    hiddenIntruder: { x: 520, y: 310, visible: true },
  });

  assert.equal(layout.bankTruck.visible, false);
  assert.equal(layout.hiddenIntruder.visible, true);
});
