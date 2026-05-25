import { getNextPhotoIndex, getPreviousPhotoIndex } from "../utils/navigation";

/**
 * Touch event handlers for the photo viewer
 */
export interface TouchHandlers {
  /**
   * Handles touch start event to initiate touch interaction
   * Records initial touch position for both X and Y axes
   * @param e Touch event
   */
  handleTouchStart: (e: TouchEvent) => void;
  /**
   * Handles touch move event to rotate through photos or allow scrolling
   * Detects drag direction on first move and only rotates for horizontal drags
   * Prevents default scrolling behavior for horizontal drags only
   * @param e Touch event
   */
  handleTouchMove: (e: TouchEvent) => void;
  /**
   * Handles touch end event to complete the touch interaction
   * Resets all touch state and direction detection
   * @param e Touch event
   */
  handleTouchEnd: (e: TouchEvent) => void;
}

/**
 * Dependencies required for touch event handlers
 */
export interface TouchHandlerDependencies {
  /**
   * Gets the current drag state including touch-specific properties
   * @returns Current drag state including positions, direction, and active photo
   */
  getDragState: () => {
    /** Whether user is currently dragging */
    isDragging: boolean;
    /** Initial X position when touch started */
    startX: number;
    /** Initial Y position when touch started */
    startY: number;
    /** Last X position where photo changed */
    lastChangeX: number;
    /** Detected drag direction (null until determined) */
    dragDirection: "horizontal" | "vertical" | null;
    /** Index of currently active photo */
    activePhoto: number;
  };
  /**
   * Updates the drag state
   * @param state Partial state object to merge with current state
   */
  setDragState: (state: Partial<{
    isDragging: boolean;
    startX: number;
    startY: number;
    lastChangeX: number;
    dragDirection: "horizontal" | "vertical" | null;
    activePhoto: number;
  }>) => void;
  /**
   * Triggers a re-render of the photo viewer to reflect state changes
   */
  updateView: () => void;
  /** Array of image URLs for the 360 view */
  images: string[];
}

/**
 * Creates touch event handlers for the photo viewer
 * Supports gesture detection to differentiate between horizontal (rotate) and vertical (scroll) drags
 * @param deps Dependencies including state management and image array
 * @returns Object containing touch event handler functions
 */
export const createTouchHandlers = (deps: TouchHandlerDependencies): TouchHandlers => {
  let targetElement: HTMLElement | null = null;

  /**
   * Handles touch start event to initiate touch interaction
   * Records initial touch position for both X and Y axes
   * @param e Touch event
   */
  const handleTouchStart = (e: TouchEvent) => {
    if (!(e.currentTarget instanceof HTMLElement)) return;
    targetElement = e.currentTarget;
    
    const state = deps.getDragState();
    deps.setDragState({
      isDragging: true,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      lastChangeX: e.touches[0].clientX,
      dragDirection: null,
    });
    
    // Attach listeners to document for dragging outside element
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
  };

  /**
   * Handles touch move event to rotate through photos or allow scrolling
   * Detects drag direction on first move and only rotates for horizontal drags
   * Prevents default scrolling behavior for horizontal drags only
   * @param e Touch event
   */
  const handleTouchMove = (e: TouchEvent) => {
    const state = deps.getDragState();
    if (!state.isDragging || !targetElement) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    // Determine drag direction on first move
    if (state.dragDirection === null) {
      const deltaX = Math.abs(currentX - state.startX);
      const deltaY = Math.abs(currentY - state.startY);

      // If moved more than 10px, determine direction
      if (deltaX > 10 || deltaY > 10) {
        const direction = deltaX > deltaY ? "horizontal" : "vertical";
        deps.setDragState({ dragDirection: direction });
      }
    }

    // Only handle horizontal drags
    const updatedState = deps.getDragState();
    if (updatedState.dragDirection === "horizontal") {
      e.preventDefault(); // Prevent scrolling for horizontal drags

      const deltaX = currentX - updatedState.lastChangeX;
      const viewerWidth = targetElement.offsetWidth;
      const threshold = viewerWidth / deps.images.length;

      if (Math.abs(deltaX) >= threshold) {
        let newActivePhoto = updatedState.activePhoto;
        
        if (deltaX > 0) {
          // Dragged right - go to previous
          newActivePhoto = getPreviousPhotoIndex(updatedState.activePhoto, deps.images.length);
        } else {
          // Dragged left - go to next
          newActivePhoto = getNextPhotoIndex(updatedState.activePhoto, deps.images.length);
        }
        
        deps.setDragState({
          activePhoto: newActivePhoto,
          lastChangeX: currentX,
        });
        deps.updateView();
      }
    }
    // For vertical drags, do nothing (allow natural scrolling)
  };

  /**
   * Handles touch end event to complete the touch interaction
   * Resets all touch state and direction detection
   * @param e Touch event
   */
  const handleTouchEnd = (e: TouchEvent) => {
    const state = deps.getDragState();
    if (!state.isDragging) return;
    
    deps.setDragState({
      isDragging: false,
      dragDirection: null,
      startX: 0,
      startY: 0,
      lastChangeX: 0,
    });
    
    // Remove document listeners
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    targetElement = null;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
