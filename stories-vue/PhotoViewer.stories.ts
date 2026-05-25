import type { Meta, StoryObj } from '@storybook/vue3';
import { AspectRatio } from "../src";
import PhotoViewerWrapper from './PhotoViewerWrapper.vue';
import "../src/styles/viewer.scss";

const meta: Meta<typeof PhotoViewerWrapper> = {
  title: 'Vue/PhotoViewer',
  component: PhotoViewerWrapper,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Interactive 360-degree photo viewer component wrapped for React.",
      },
    },
  },
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
        description: "Aspect ratio of the viewer container",
      },
      showAnimateButton: {
        control: "boolean",
        description: "Show the animation toggle button",
      },
      autoPlay: {
        control: "boolean",
        description: "Automatically start animation on load",
      },
      autoPlayOnce: {
        control: "boolean",
        description: "Play animation once to show interactivity",
      },
      reverseDirection: {
        control: "boolean",
        description: "Reverse animation direction (clockwise)",
      },
      animationSpeed: {
        control: "number",
        description: "Animation speed in milliseconds",
      },
      animateButtonPosition: {
        control: "select",
        options: ["top-left", "top-right", "bottom-left", "bottom-right"],
        description: "Position of the animate button",
      },
    },
};

export default meta;
type Story = StoryObj<typeof PhotoViewerWrapper>;

export const VueExample: Story = {
  args: {
    altAttribute: '360-degree view of Pottery',
    aspectRatio: AspectRatio.RATIO_1_1,
    autoPlay: true,
    showAnimateButton: true,
    animateButtonPosition: 'top-right',
  },
};
