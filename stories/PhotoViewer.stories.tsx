import type { Meta, StoryObj } from "@storybook/preact";
import { PhotoViewer, AspectRatio } from "../src";
import "../src/styles/viewer.scss";
import {
  pottery16x9Images,
  pottery4x3Images,
  potteryImages,
  troll3x4Images,
  troll9x16Images,
  trollImages,
} from "./test.storyData";
import { generate1x1Images } from "./imageGenerators";

const meta: Meta<typeof PhotoViewer> = {
  title: "360 Photo Viewer",
  component: PhotoViewer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    images: {
      description:
        "Array of image URLs for the 360-degree view. Images will be displayed in sequence as the user drags horizontally.",
    },
    altAttribute: {
      control: "text",
      description:
        "Alt text for accessibility. Use in place of alt attribute that would be used for single image.",
    },
    aspectRatio: {
      control: "select",
      options: Object.values(AspectRatio),
      description: "Aspect ratio of the viewer container.",
    },
    showAnimateButton: {
      control: "boolean",
      description: "Show the animation toggle button.",
    },
    autoPlay: {
      control: "boolean",
      description: "Automatically start animation on load.",
    },
    autoPlayOnce: {
      control: "boolean",
      description: "Play animation once to show interactivity.",
    },
    reverseDirection: {
      control: "boolean",
      description: "Reverse animation direction (clockwise).",
    },
    animationSpeed: {
      control: "number",
      description: "Animation speed in milliseconds between frame transitions.",
    },
    animateButtonPosition: {
      control: "select",
      options: ["top-left", "top-right", "bottom-left", "bottom-right"],
      description: "Position of the animate button in the viewer.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhotoViewer>;

// Default story
export const Default: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll figurine",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
    autoPlayOnce: false,
    autoPlay: false,
    reverseDirection: false,
    animationSpeed: 1000,
  },
};

// 4:3 Landscape
export const Ratio4x3: Story = {
  args: {
    images: pottery4x3Images,
    altAttribute: "360-degree rotating pottery in 4:3 aspect ratio",
    aspectRatio: AspectRatio.RATIO_4_3,
  },
};

// 3:4 Portrait
export const Ratio3x4: Story = {
  args: {
    images: troll3x4Images,
    altAttribute: "360-degree rotating troll in 3:4 portrait aspect ratio",
    aspectRatio: AspectRatio.RATIO_3_4,
  },
};

// 16:9 Widescreen
export const Ratio16x9: Story = {
  args: {
    images: pottery16x9Images,
    altAttribute: "360-degree rotating pottery in 16:9 widescreen aspect ratio",
    aspectRatio: AspectRatio.RATIO_16_9,
  },
};

// 9:16 Portrait Widescreen
export const Ratio9x16: Story = {
  args: {
    images: troll9x16Images,
    altAttribute:
      "360-degree rotating troll in 9:16 portrait widescreen aspect ratio",
    aspectRatio: AspectRatio.RATIO_9_16,
  },
};

// 1:1 Square
export const Ratio1x1: Story = {
  args: {
    images: potteryImages,
    altAttribute: "360-degree rotating pottery in 1:1 square aspect ratio",
    aspectRatio: AspectRatio.RATIO_1_1,
  },
};

// Show Animate Button
export const ShowAnimateButton: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll with animation controls",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
  },
};

// Many frames
export const ManyFrames: Story = {
  args: {
    images: generate1x1Images(36),
    altAttribute: "360-degree view with 36 frames for smooth rotation",
    aspectRatio: AspectRatio.RATIO_1_1,
  },
};

// No images
export const NoImages: Story = {
  args: {
    images: [],
    altAttribute: "360-degree viewer with no images",
    aspectRatio: AspectRatio.RATIO_1_1,
  },
};

// Auto Play
export const AutoPlay: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll with auto-play enabled",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
    autoPlay: true,
  },
};

// Auto Play Once (shows interactivity then stops, no button)
export const AutoPlayOnce: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll that auto-plays once",
    aspectRatio: AspectRatio.RATIO_1_1,
    autoPlayOnce: true,
    animationSpeed: 100,
  },
};

// Reverse Direction
export const ReverseDirection: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll in reverse (clockwise) direction",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
    autoPlay: false,
    reverseDirection: true,
  },
};

// Fast Animation Speed
export const FastAnimation: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll with fast animation",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
    autoPlay: true,
    animationSpeed: 100,
  },
};

// Slow Animation Speed
export const SlowAnimation: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll with slow animation",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
    autoPlay: true,
    animationSpeed: 2000,
  },
};

// Animate Button - Top Left
export const AnimateButtonTopLeft: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll with animate button in top-left",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
    animateButtonPosition: "top-left",
  },
};

// Animate Button - Top Right
export const AnimateButtonTopRight: Story = {
  args: {
    images: trollImages,
    altAttribute: "360-degree rotating troll with animate button in top-right",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
    animateButtonPosition: "top-right",
  },
};

// Animate Button - Bottom Left
export const AnimateButtonBottomLeft: Story = {
  args: {
    images: trollImages,
    altAttribute:
      "360-degree rotating troll with animate button in bottom-left",
    aspectRatio: AspectRatio.RATIO_1_1,
    showAnimateButton: true,
    animateButtonPosition: "bottom-left",
  },
};
