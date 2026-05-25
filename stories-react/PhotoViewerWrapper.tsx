import * as React from "react";
import { useEffect, useRef } from "react";
import { render } from "preact";
import { PhotoViewer, PhotoViewerProps } from "../src";
import "../src/styles/viewer.scss";

const PhotoViewerWrapper: React.FC<PhotoViewerProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Render the Preact component into the container
    const preactElement = PhotoViewer(props);
    render(preactElement, containerRef.current);

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        render(null, containerRef.current);
      }
    };
  }, [
    props.images,
    props.altAttribute,
    props.aspectRatio,
    props.showAnimateButton,
    props.autoPlay,
    props.autoPlayOnce,
    props.reverseDirection,
    props.animationSpeed,
    props.animateButtonPosition,
  ]);

  return React.createElement("div", { ref: containerRef });
};

export default PhotoViewerWrapper;
