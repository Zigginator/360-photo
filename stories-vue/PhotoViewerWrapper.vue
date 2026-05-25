<template>
  <div ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, toRefs } from 'vue';
import { PhotoViewer, AspectRatio } from '../src';
import { render } from 'preact';
import { potteryImages } from '../stories/test.storyData';
import '../src/styles/viewer.scss';

interface Props {
  altAttribute: string;
  aspectRatio?: string;
  showAnimateButton?: boolean;
  autoPlay?: boolean;
  autoPlayOnce?: boolean;
  reverseDirection?: boolean;
  animationSpeed?: number;
  animateButtonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 'RATIO_1_1',
  showAnimateButton: false,
  autoPlay: false,
  autoPlayOnce: false,
  reverseDirection: false,
  animationSpeed: 1000,
  animateButtonPosition: 'bottom-right'
});

const containerRef = ref<HTMLDivElement>();

const renderComponent = () => {
  if (!containerRef.value) return;
  
  render(
    PhotoViewer({
      images: potteryImages,
      altAttribute: props.altAttribute,
      aspectRatio: AspectRatio[props.aspectRatio as keyof typeof AspectRatio],
      showAnimateButton: props.showAnimateButton,
      autoPlay: props.autoPlay,
      autoPlayOnce: props.autoPlayOnce,
      reverseDirection: props.reverseDirection,
      animationSpeed: props.animationSpeed,
      animateButtonPosition: props.animateButtonPosition
    }),
    containerRef.value
  );
};

onMounted(() => {
  renderComponent();
});

watch(() => props, renderComponent, { deep: true });
</script>
