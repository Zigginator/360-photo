/**
 * Animation controls for the photo viewer
 */
export interface AnimationControls {
  /**
   * Starts the animation
   */
  start: () => void;
  /**
   * Stops the animation
   */
  stop: () => void;
  /**
   * Toggles animation on/off
   */
  toggle: () => void;
  /**
   * Returns whether animation is currently running
   */
  isRunning: () => boolean;
}

/**
 * Dependencies required for animation controls
 */
export interface AnimationDependencies {
  /**
   * Gets the current active photo index
   */
  getActivePhoto: () => number;
  /**
   * Sets the active photo index
   */
  setActivePhoto: (index: number) => void;
  /**
   * Total number of photos
   */
  totalPhotos: number;
  /**
   * Animation interval in milliseconds
   * @default 1000
   */
  intervalMs?: number;
  /**
   * Triggers a re-render of the photo viewer to reflect state changes
   */
  updateView: () => void;
  /**
   * Reverse the animation direction (go backwards)
   * @default false
   */
  reverse?: boolean;
  /**
   * Callback fired after completing one full cycle of images
   */
  onComplete?: () => void;
}

/**
 * Creates animation controls for the photo viewer
 * @param deps Dependencies including state management and configuration
 * @returns Object containing animation control functions
 */
export const createAnimationControls = (deps: AnimationDependencies): AnimationControls => {
  let animationInterval: number | null = null;
  const intervalMs = deps.intervalMs ?? 1000;
  const reverse = deps.reverse ?? false;

  /**
   * Stops the animation interval if running
   */
  const stop = () => {
    if (animationInterval !== null) {
      clearInterval(animationInterval);
      animationInterval = null;
      deps.updateView();
    }
  };

  /**
   * Starts the animation
   */
  const start = () => {
    // Don't start if already running
    if (animationInterval !== null) return;

    animationInterval = window.setInterval(() => {
      const currentPhoto = deps.getActivePhoto();
      let nextPhoto: number;
      
      if (reverse) {
        // Go backwards (next photo)
        nextPhoto = (currentPhoto + 1) % deps.totalPhotos;
      } else {
        // Go forwards (previous photo)
         nextPhoto = (currentPhoto - 1 + deps.totalPhotos) % deps.totalPhotos;
      }
      
      deps.setActivePhoto(nextPhoto);
      deps.updateView();
      
      // Check if we've completed a full cycle (back to first image)
      if (nextPhoto === 0 && deps.onComplete) {
        deps.onComplete();
      }
    }, intervalMs);
    deps.updateView();
  };

  /**
   * Toggles animation on/off
   */
  const toggle = () => {
    if (animationInterval !== null) {
      stop();
    } else {
      start();
    }
  };

  /**
   * Returns whether animation is currently running
   */
  const isRunning = () => {
    return animationInterval !== null;
  };

  return {
    start,
    stop,
    toggle,
    isRunning,
  };
};
