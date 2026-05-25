# 360-photo
Tool to use on your website that allows your users to rotate your product in a 360 view. Select how many angles you have of your product, and then set your alt text.

## Using the component

### Prerequisites to using
- Array of images for intended 360 effect of exact same dimensions
- This component's dimensions are fluid to it's container. So if you put this inside a div that is 400px x 400px the component will fill that width and height at 100%.
- I want to make this framework agnostic, to work the same across everything. However I only have limited experience with a few frameworks.
- I'm open to expanding this and aware I may not have considered more meaningful usecases for a 360 tool. This project was born out of wanting a way to display my art and hobbies in a fun way. As well as expanding my experience writing without the help of functions built into other frameworks to improve my js knowledge.
- On the above point I wont be expanding this to try be or do many other things, because thats when features become unusable 💩. By all means you can technically use this, for example, as an image carousel but it wont be accessibility compliant as there wont be alt attributes assigned to each image individually. Just use for its intended purpose. Heck I'll make a carousel package next based on the setup of this package as its halfway there already.    

### Props
#### `images` (required)
- **Type:** `string[]`
- **Description:** Array of images in direciton of rotation to animate in 360 view. Please make sure image sizes are consistent for best results.

#### `altAttribute` (required)
- **Type:** `string`
- **Description:** In order to be compliant with a11y standards, this value should always be provided as if you're providing an alt tag to a single image. Non negotiable.


#### `aspectRatio` (optional)
- **Type:** `AspectRatio` (`RATIO_1_1` | `RATIO_4_3` | `RATIO_3_4` | `RATIO_16_9` | `RATIO_9_16`)
- **Default:** `AspectRatio.RATIO_1_1`
- **Description:** Set aspect ratio for the photo viewer, default set to 1 / 1. Ensure `images` array matches aspect ratio closely for best results.

#### `showAnimateButton` (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Toggle visibility of the animation button. Animation runs anti-clockwise by default

#### `autoPlay` (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Sets rotation animation on loop, runs on load. Not accessibility friendly, use with caution.

#### `autoPlayOnce` (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Plays the rotation animation once, runs when the component has loaded to show the user the component is interactable

#### `reverseDirection` (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Toggle the animation to clockwise rotation

#### `animationSpeed` (optional)
- **Type:** `number`
- **Default:** `1000`
- **Description:** Set the speed of animation in milliseconds

#### `animateButtonPosition` (optional)
- **Type:** `AnimateButtonPosition` (`"top-left"` | `"top-right"` | `"bottom-left"` | `"bottom-right"`)
- **Default:** `"bottom-right"`
- **Description:** Position of the animate button on the component. Choice between four corners, default set to bottom right.

### Accessibility
I try to focus on accessibilty when I build components, and will address a11y crimes when I see them in my job. But am aware I probably might miss things too.    
The disappointment with how some of these tools are built without considering a11y is part of why I made this.    
Using this same thinking, I offer the user an option to navigate the 360 view using arrow buttons that will display via tab navigation, as well as the option to play the animation button as well (whether its hidden or not when ingested into a project/page).    
There is an`alt` prop being available to give a value to in the form of a required prop which will be assigned to the 360 viewer component itself via `aria-label`.    
The 360 viewer's `role` is `region` as opposed to `img` so the buttons within the container can still be accessible, as using `img` hides them.
I'm not sure what meaningful information an `alt` attribute can provide to the user in a collection of possibly many angles of the same photo, so they will be considered decorative and left blank.
I consider this a decorative image, and believe this would result in cognitive overload if authoring the alt attribute with the same value over and over again. And I can't imagine what benefit a user would have being told they're seeing image #5 out of 20 or the same `alt` description over and over when expecting the experience of a blog or product page.    

## Installation & Usage

### Via JSR

Install using JSR:
```bash
# Deno
deno add @zigginator/360-photo

# npm (with JSR compatibility)
npx jsr add @zigginator/360-photo

# pnpm
pnpm dlx jsr add @zigginator/360-photo

# Yarn
yarn dlx jsr add @zigginator/360-photo
```

Import the component and include the stylesheet:
```typescript
import { PhotoViewer, AspectRatio } from '@zigginator/360-photo';
```

```html
<link rel="stylesheet" href="node_modules/@jsr/zigginator__360-photo/dist/index.css" />
```

Example usage:
```typescript
import { h, render } from 'preact';
import { PhotoViewer, AspectRatio } from '@zigginator/360-photo';

const images = [
  '/images/angle-1.jpg',
  '/images/angle-2.jpg',
  // ... more angles
];

const viewer = h(PhotoViewer, {
  images: images,
  aspectRatio: AspectRatio.RATIO_16_9,
  altAttribute: '360 degree view of product',
  showAnimateButton: true,
  autoPlayOnce: true
});

render(viewer, document.getElementById('viewer-container'));
```

### For Vanilla JS (No Build Tools)

Use a CDN that supports JSR packages:

```html
<link rel="stylesheet" href="https://esm.sh/jsr/@zigginator/360-photo/dist/index.css" />

<script type="module">
  import { PhotoViewer, AspectRatio, h, render } from 'https://esm.sh/jsr/@zigginator/360-photo';
  
  const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
  
  const viewer = h(PhotoViewer, {
    images: images,
    aspectRatio: AspectRatio.RATIO_16_9,
    altAttribute: '360 degree view of product'
  });
  
  render(viewer, document.getElementById('viewer-container'));
</script>
```

See [example.html](example.html) for a complete working example.

**Note for local development:** You can also reference the built CSS locally by changing the CSS link to `href="dist/index.css"` after running `npm run build:css`.

### For Fresh (Deno Framework)

Fresh doesn't bundle CSS like traditional build tools, so you'll need to include styles via a `<link>` tag:

```tsx
// routes/_app.tsx
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }) {
  return (
    <html>
      <Head>
        <link rel="stylesheet" href="https://esm.sh/jsr/@zigginator/360-photo/dist/index.css" />
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}
```

Use the component in an island:

```tsx
// islands/Viewer360.tsx
import { h } from "preact";
import { PhotoViewer, AspectRatio } from "jsr:@zigginator/360-photo";

export default function Viewer360() {
  const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
  
  return h(PhotoViewer, {
    images: images,
    aspectRatio: AspectRatio.RATIO_16_9,
    altAttribute: '360 degree view of product'
  });
}
```

## For Contributors

### Development & Testing
- **[example.html](example.html)** - Vanilla JS example using CDN (works immediately)
- **Storybook** - Run `npm run storybook` for interactive development

### Storybook
#### Todo: No docgen support for Preact
Unlike in React projects I have worked on where I have taken this for granted, there is unfortunately no docgen support for Preact. You might notice I have written similar descriptions for the args in the stories file, that is why.

A future to-do item is setting up this addon with the project https://storybook.js.org/addons/storybook-addon-jsdoc-to-mdx . With the goal that the jsDocs can manually generate to Storybook on each run of the `storybook` script.

#### Todo: Composition
Implement composition to preview component working on other frameworks in the main story. It would be nice to see all the examples in the same place.