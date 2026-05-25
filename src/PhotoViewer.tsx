import { h } from "preact";
import { AspectRatio, AnimateButtonPosition } from "./types";
import { createMouseHandlers } from "./handlers/mouseHandlers";
import { createTouchHandlers } from "./handlers/touchHandlers";
import { getNextPhotoIndex, getPreviousPhotoIndex } from "./utils/navigation";
import { createAnimationControls } from "./utils/animation";
import {
  LeftCarat,
  RightCarat,
  AntiClockwiseRotatePlay,
  AntiClockwiseRotateStop,
  ClockwiseRotatePlay,
  ClockwiseRotateStop,
} from "./static/svg";

/**
 * Props for the PhotoViewer component
 */
export interface PhotoViewerProps {
  /**
   * Array of image URLs for the 360-degree view.
   * Images will be displayed in sequence as the user drags horizontally.
   */
  images: string[];
  /**
   * The viewer container will have this alt text to provide context for the entire interactive element.
   * This will act as the sole alt attribute for what you are displaying, so it should be descriptive of
   * the content and purpose of the images.
   * This is important for accessibility and screen readers as the images themselves will have empty alt
   * attributes to avoid redundancy and cognitive overload for screen reader users.
   */
  altAttribute: string;
  /**
   * Aspect ratio of the viewer container.
   * @default AspectRatio.RATIO_1_1
   */
  aspectRatio?: AspectRatio;
  /**
   * Whether to show the animate button for the 360-degree view.
   * @default false
   */
  showAnimateButton?: boolean;
  /**
   * Automatically start animation when component loads.
   * Can be stopped/started with the animate button if shown.
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Play animation once on load to show interactivity, then stop.
   * @default false
   */
  autoPlayOnce?: boolean;
  /**
   * Reverse the animation direction (go backwards through images).
   * Useful for 360-degree views to show rotation in the opposite direction.
   * @default false
   */
  reverseDirection?: boolean;
  /**
   * Animation speed in milliseconds between frame transitions.
   * Lower values = faster animation.
   * @default 1000
   */
  animationSpeed?: number;
  /**
   * Position of the animate button in the viewer.
   * @default "bottom-right"
   */
  animateButtonPosition?: AnimateButtonPosition;
}

/**
 * Interactive 360-degree photo viewer component.
 *
 * Supports mouse drag and touch gestures to rotate through a sequence of images.
 * Automatically detects horizontal vs vertical swipes on mobile to allow scrolling
 * while providing smooth 360-degree rotation on horizontal drags.
 *
 * @example
 * ```tsx
 * <PhotoViewer
 *   images={[
 *     "/images/frame-001.jpg",
 *     "/images/frame-002.jpg",
 *     "/images/frame-003.jpg",
 *   ]}
 *   aspectRatio={AspectRatio.RATIO_1_1}
 * />
 * ```
 */
export const PhotoViewer = ({
  images,
  altAttribute,
  aspectRatio = AspectRatio.RATIO_1_1,
  showAnimateButton = false,
  autoPlay = false,
  autoPlayOnce = false,
  reverseDirection = false,
  animationSpeed = 1000,
  animateButtonPosition = "bottom-right",
}: PhotoViewerProps): h.JSX.Element => {
  // Drag state
  let activePhoto = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let lastChangeX = 0;
  let dragDirection: "horizontal" | "vertical" | null = null;
  let containerElement: HTMLDivElement | null = null;

  // Track if auto-play-once has completed
  let hasAutoPlayedOnce = false;

  // Track overlay prompt state
  let showDragPrompt = true;
  let dragPromptTimeout: number | null = null;

  // Track if component has been visible in viewport
  let hasBeenVisible = false;
  let intersectionObserver: IntersectionObserver | null = null;

  // Create animation controls
  const animationControls = createAnimationControls({
    getActivePhoto: () => activePhoto,
    setActivePhoto: (index) => {
      activePhoto = index;
    },
    totalPhotos: images.length,
    updateView: () => updateView(),
    reverse: reverseDirection,
    intervalMs: animationSpeed,
    onComplete: autoPlayOnce
      ? () => {
          if (!hasAutoPlayedOnce) {
            hasAutoPlayedOnce = true;
            animationControls.stop();
          }
        }
      : undefined,
  });

  /**
   * Updates the DOM to reflect the current active photo.
   * Scoped to this component instance to support multiple viewers on the same page.
   */
  const updateView = () => {
    if (!containerElement) return;
    const photos = containerElement.querySelectorAll(".photo-frame");
    photos.forEach((photo, index) => {
      if (index === activePhoto) {
        photo.classList.add("photo-frame--active");
      } else {
        photo.classList.remove("photo-frame--active");
      }
    });

    // Update animate button icon visibility and aria-label
    const animateButton = containerElement.querySelector(".button--animate");
    if (animateButton) {
      const isRunning = animationControls.isRunning();
      if (isRunning) {
        animateButton.classList.add("button--animate-playing");
        animateButton.classList.remove("button--animate-stopped");
        animateButton.setAttribute("aria-label", "Stop animation");
      } else {
        animateButton.classList.add("button--animate-stopped");
        animateButton.classList.remove("button--animate-playing");
        animateButton.setAttribute("aria-label", "Start animation");
      }
    }
  };

  /**
   * Returns the current drag state for handlers.
   */
  const getDragState = () => ({
    activePhoto,
    isDragging,
    startX,
    startY,
    lastChangeX,
    dragDirection,
  });

  /**
   * Updates the drag state with new values.
   * Only updates properties that are provided in the state object.
   */
  const setDragState = (
    state: Partial<{
      activePhoto: number;
      isDragging: boolean;
      startX: number;
      startY: number;
      lastChangeX: number;
      dragDirection: "horizontal" | "vertical" | null;
    }>,
  ) => {
    if (state.activePhoto !== undefined) activePhoto = state.activePhoto;
    if (state.isDragging !== undefined) {
      isDragging = state.isDragging;
      // Stop animation when user starts dragging
      if (isDragging) {
        animationControls.stop();
      }
    }
    if (state.startX !== undefined) startX = state.startX;
    if (state.startY !== undefined) startY = state.startY;
    if (state.lastChangeX !== undefined) lastChangeX = state.lastChangeX;
    if (state.dragDirection !== undefined) dragDirection = state.dragDirection;
  };

  // Create handlers
  const mouseHandlers = createMouseHandlers({
    getDragState,
    setDragState,
    updateView,
    images,
  });

  const touchHandlers = createTouchHandlers({
    getDragState,
    setDragState,
    updateView,
    images,
  });

  /**
   * Hides the drag prompt overlay for this specific instance
   */
  const hideDragPrompt = () => {
    if (!containerElement || !showDragPrompt) return;
    const overlay = containerElement.querySelector(".drag-prompt-overlay");
    if (overlay && overlay.parentElement === containerElement) {
      overlay.classList.add("drag-prompt-overlay--hidden");
      showDragPrompt = false;
      if (dragPromptTimeout !== null) {
        clearTimeout(dragPromptTimeout);
        dragPromptTimeout = null;
      }
    }
  };

  /**
   * Ref callback that attaches touch event listeners with passive: false.
   * This allows preventDefault() to work for preventing scroll during horizontal drags.
   * Also stores the container element reference for scoped DOM queries.
   * Additionally starts auto-play animation if configured.
   * Sets up IntersectionObserver to trigger effects when component enters viewport.
   */
  const attachTouchListeners = (element: HTMLDivElement | null) => {
    if (!element) return;

    // Store container reference for scoped queries
    containerElement = element;

    // Attach touch start listener to element
    element.addEventListener("touchstart", touchHandlers.handleTouchStart, {
      passive: false,
    });

    // Set up IntersectionObserver to trigger on first visibility
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenVisible) {
            hasBeenVisible = true;

            // Start auto-play if configured
            if ((autoPlay || autoPlayOnce) && !animationControls.isRunning()) {
              animationControls.start();
            }

            // Set timeout to hide drag prompt after 3 seconds
            dragPromptTimeout = window.setTimeout(() => {
              hideDragPrompt();
            }, 3000);

            // Disconnect observer after first trigger
            if (intersectionObserver) {
              intersectionObserver.disconnect();
              intersectionObserver = null;
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of component is visible
      },
    );

    intersectionObserver.observe(element);
  };

  const previousButton = (
    <button
      class="button button--arrow"
      aria-label="Previous photo"
      title="Previous photo"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        animationControls.stop();
        activePhoto = getNextPhotoIndex(activePhoto, images.length);
        updateView();
      }}
    >
      <LeftCarat />
    </button>
  );

  const nextButton = (
    <button
      class="button button--arrow"
      aria-label="Next photo"
      title="Next photo"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        animationControls.stop();
        activePhoto = getPreviousPhotoIndex(activePhoto, images.length);
        updateView();
      }}
    >
      <RightCarat />
    </button>
  );

  return images.length ? (
    <div
      ref={attachTouchListeners}
      class="photo-viewer"
      role="region"
      onMouseDown={(e) => {
        hideDragPrompt();
        mouseHandlers.handleMouseDown(e);
      }}
      onTouchStart={() => hideDragPrompt()}
      style={{ cursor: "grab" }}
      aria-label={`360 Degree Photo Viewer: ${altAttribute}`}
      aria-describedby="photo-viewer-hint"
    >
      <span id="photo-viewer-hint" class="sr-only">
        Drag to rotate
      </span>

      {/* Drag prompt overlay */}
      <div class="drag-prompt-overlay" aria-hidden="true">
        <div class="drag-prompt-content">
          <LeftCarat className="drag-prompt-icon" />
          <p class="drag-prompt-text">Drag to rotate</p>
          <RightCarat className="drag-prompt-icon" />
        </div>
      </div>

      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt=""
          class={`photo-frame 
            ${index === activePhoto ? "photo-frame--active" : ""} 
            ${aspectRatio === AspectRatio.RATIO_16_9 ? "photo-frame--16-9" : ""}
            ${aspectRatio === AspectRatio.RATIO_9_16 ? "photo-frame--9-16" : ""} 
            ${aspectRatio === AspectRatio.RATIO_4_3 ? "photo-frame--4-3" : ""} 
            ${aspectRatio === AspectRatio.RATIO_3_4 ? "photo-frame--3-4" : ""} 
            ${aspectRatio === AspectRatio.RATIO_1_1 ? "photo-frame--1-1" : ""} 
          `}
          draggable={false}
        />
      ))}

      <div class={`button-panel button-panel--${animateButtonPosition}`}>
        {
          <button
            class={`button button--animate button--animate-stopped ${!showAnimateButton && "button--animate-invisible"}`}
            aria-label="Start animation"
            title="Toggle animation"
            data-direction={reverseDirection ? "clockwise" : "anticlockwise"}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              animationControls.toggle();
              updateView();
            }}
          >
            <AntiClockwiseRotatePlay className="icon-anticlockwise-play" />
            <AntiClockwiseRotateStop className="icon-anticlockwise-stop" />
            <ClockwiseRotatePlay className="icon-clockwise-play" />
            <ClockwiseRotateStop className="icon-clockwise-stop" />
          </button>
        }
      </div>

      <div class="button-panel button-panel--arrows">
        {previousButton}
        {nextButton}
      </div>
    </div>
  ) : (
    <div class="photo-viewer--no-images">
      <p>No images to display</p>
    </div>
  );
};

export default PhotoViewer;
