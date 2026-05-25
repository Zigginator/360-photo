/**
 * Aspect ratio options for the 360 photo viewer
 */
export enum AspectRatio {
  /** 4:3 aspect ratio (1.333:1) */
  RATIO_4_3 = '4:3',
  /** 3:4 aspect ratio (0.75:1) - portrait */
  RATIO_3_4 = '3:4',
  /** 16:9 aspect ratio (1.778:1) - widescreen */
  RATIO_16_9 = '16:9',
  /** 9:16 aspect ratio (0.563:1) - portrait widescreen */
  RATIO_9_16 = '9:16',
  /** 1:1 aspect ratio - square */
  RATIO_1_1 = '1:1',
}

/**
 * Position for the animate button
 */
export type AnimateButtonPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
