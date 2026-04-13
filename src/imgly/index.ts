/**
 * CE.SDK Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the editor.
 * Import and call `initEditor()` to configure a CE.SDK instance.
 *
 * This module is agnostic - it contains no product-specific logic.
 * Product orchestration belongs in App.tsx.
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration
import { ProductEditorConfig } from './config/plugin';

// Exports for external use
export { ProductEditorConfig } from './config/plugin';

// Export types
export type {
  AreaConfig,
  BackdropConfig,
  MaskConfig,
  ProductMetadata,
  DesignUnit,
  Source
} from './types';

// Export constants
export {
  BACKDROP_BLOCK_KIND,
  MASK_BLOCK_KIND,
  METADATA_KEYS,
  ZOOM_PADDING
} from './constants';

// Export backdrop functions
export {
  createBackdrop,
  updateBackdropImages,
  showBackdrop,
  clearBackdrops,
  getPageBackdropConfig
} from './backdrop';

// Export mask functions
export { setMaskConfig, updateMasks, clearMasks } from './mask';

// Export page and scene functions
export { createOrUpdateScene, getVisibleAreaId, switchArea } from './page';

/**
 * Initialize the CE.SDK Editor with plugins and UI configuration.
 *
 * This function sets up the editor with asset sources and UI components
 * but does NOT create a scene or load any content. Scene creation is
 * handled by App.tsx using the scene functions.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initProductEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new ProductEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );
}
