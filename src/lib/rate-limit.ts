// Simple event bus for rate limit notifications shared across the app
// Uses DOM EventTarget under the hood so it works across isolated modules

type RateLimitEventDetail = {
  untilTimestampMs: number; // epoch ms when cooldown ends
  retryAfterSeconds: number; // seconds suggested by server or default
};

const RATE_LIMIT_EVENT = "app:rate-limit";

class RateLimitBus {
  private readonly target: EventTarget;

  constructor() {
    this.target = typeof window !== "undefined" ? window : new EventTarget();
  }

  public emit(detail: RateLimitEventDetail): void {
    const evt = new CustomEvent<RateLimitEventDetail>(RATE_LIMIT_EVENT, {
      detail,
    });
    this.target.dispatchEvent(evt);
  }

  public on(handler: (detail: RateLimitEventDetail) => void): () => void {
    const listener = (evt: Event) => {
      const custom = evt as CustomEvent<RateLimitEventDetail>;
      handler(custom.detail);
    };
    this.target.addEventListener(RATE_LIMIT_EVENT, listener as EventListener);
    return () =>
      this.target.removeEventListener(
        RATE_LIMIT_EVENT,
        listener as EventListener,
      );
  }
}

export const rateLimitBus = new RateLimitBus();
export type { RateLimitEventDetail };
export const RATE_LIMIT_EVENT_NAME = RATE_LIMIT_EVENT;

// Global in-memory cooldown timestamp (epoch ms). When in cooldown, outbound
// requests should be short-circuited and UI should inform the user.
let rateLimitUntilTimestampMs: number | null = null;

export function setRateLimitUntil(untilTimestampMs: number): void {
  rateLimitUntilTimestampMs = untilTimestampMs;
}

export function getRateLimitUntil(): number | null {
  return rateLimitUntilTimestampMs;
}

export function getRateLimitRemainingSeconds(
  nowMs: number = Date.now(),
): number {
  if (!rateLimitUntilTimestampMs) return 0;
  return Math.max(0, Math.ceil((rateLimitUntilTimestampMs - nowMs) / 1000));
}
