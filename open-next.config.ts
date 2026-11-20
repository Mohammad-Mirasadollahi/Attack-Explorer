import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * Cloudflare Workers FREE-plan caching strategy.
 *
 * Do NOT switch to R2 / KV / Durable Object / D1 cache backends here — those
 * need extra bindings and are unnecessary for this mostly-SSG app. Workers
 * Static Assets are free + unlimited on Free, while Worker CPU is capped at
 * 10ms (Error 1102 when exceeded).
 *
 * Cache interception serves prerendered HTML from Static Assets so the heavy
 * Next.js isolate (full scenario corpus) is not loaded on normal page hits.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
