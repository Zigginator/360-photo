import { getNextPhotoIndex, getPreviousPhotoIndex } from "../utils/navigation";

/**
 * Mouse event handlers for the photo viewer
 */
export interface MouseHandlers {
  /**
   * Handles mouse down event to initiate dragging
   * @param e Mouse event
   */
  handleMouseDown: (e: MouseEvent) => void;
}

/**
 * Dependencies required for mouse event handlers
 */
export interface MouseHandlerDependencies {
  /**
   * Gets the current drag state
   * @returns Current drag state including dragging status, positions, and active photo
   */
  getDragState: () => {
    /** Whether user is currently dragging */
    isDragging: boolean;
    /** Initial X position when drag started */
    startX: number;
    /** Last X position where photo changed */
    lastChangeX: number;
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
    lastChangeX: number;
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
 * Creates mouse event handlers for the photo viewer
 * @param deps Dependencies including state management and image array
 * @returns Object containing mouse event handler functions
 */
export const createMouseHandlers = (deps: MouseHandlerDependencies): MouseHandlers => {
  let targetElement: HTMLElement | null = null;

  /**
   * Handles mouse down event to initiate dragging
   * @param e Mouse event
   */
  const handleMouseDown = (e: MouseEvent) => {
    if (!(e.currentTarget instanceof HTMLElement)) return;
    targetElement = e.currentTarget;
    
    deps.setDragState({
      isDragging: true,
      startX: e.clientX,
      lastChangeX: e.clientX,
    });
    e.currentTarget.style.cursor = "grabbing";
    
    // Attach listeners to document for dragging outside element
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  /**
   * Handles mouse move event to rotate through photos while dragging
   * Calculates drag distance and changes photo at threshold intervals
   * @param e Mouse event
   */
  const handleMouseMove = (e: MouseEvent) => {
    const state = deps.getDragState();
    if (!state.isDragging || !targetElement) return;

    const currentX = e.clientX;
    const deltaX = currentX - state.lastChangeX;

    const viewerWidth = targetElement.offsetWidth;
    const threshold = viewerWidth / deps.images.length;

    if (Math.abs(deltaX) >= threshold) {
      let newActivePhoto = state.activePhoto;
      
      if (deltaX > 0) {
        // Dragged right - go to previous
        newActivePhoto = getPreviousPhotoIndex(state.activePhoto, deps.images.length);
      } else {
        // Dragged left - go to next
        newActivePhoto = getNextPhotoIndex(state.activePhoto, deps.images.length);
      }
      
      deps.setDragState({
        activePhoto: newActivePhoto,
        lastChangeX: currentX,
      });
      deps.updateView();
    }
  };

  /**
   * Handles mouse up event to end dragging
   * @param e Mouse event
   */
  const handleMouseUp = (e: MouseEvent) => {
    const state = deps.getDragState();
    if (!state.isDragging) return;
    
    deps.setDragState({
      isDragging: false,
      startX: 0,
      lastChangeX: 0,
    });

    if (targetElement) {
      targetElement.style.cursor = "grab";
    }
    
    // Remove document listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    targetElement = null;
  };

  return {
    handleMouseDown,
  };
};
