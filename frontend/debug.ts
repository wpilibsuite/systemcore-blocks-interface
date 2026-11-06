// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */

/** URL query parameter that turns on debug features, for example `/?debug`. */
const DEBUG_PARAM = 'debug';

/**
 * Returns true if debug features, which normal users don't see, should be shown.
 * Debug mode is turned on by adding `?debug` to the URL.
 */
export function isDebugMode(): boolean {
  return new URLSearchParams(window.location.search).has(DEBUG_PARAM);
}
