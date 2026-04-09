/**
 * CE.SDK Product Editor - Main App Component
 *
 * This component orchestrates all product-related logic. The imgly folder
 * contains agnostic editor functions - all product-specific operations
 * are handled here by mapping product data to generic scene functions.
 *
 * The CreativeEditor component is passed as children from index.tsx,
 * while cesdk instance is provided via prop for product operations.
 */

import { useEffect, useState, type ReactNode } from 'react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { initProductEditor, switchArea, getVisibleAreaId } from '../imgly';

import {
  PRODUCT_SAMPLES,
  ProductConfig,
  ProductColor
} from './product-catalog';
import { setupProductScene, updateProductColor } from './utils/product';
import { Sidebar } from './Sidebar/Sidebar';
import styles from './App.module.css';

// ============================================================================
// Types
// ============================================================================

interface AppProps {
  cesdk: CreativeEditorSDK | null;
  children: ReactNode;
}

// ============================================================================
// App Component
// ============================================================================

export default function App({ cesdk, children }: AppProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [productId, setProductId] = useState('tshirt');
  const [color, setColor] = useState<ProductColor>(
    PRODUCT_SAMPLES[0].colors.find((color) => color.isDefault) ||
      PRODUCT_SAMPLES[0].colors[0]
  );

  // Initialize product scene when cesdk becomes available
  useEffect(() => {
    if (!cesdk || isInitialized) return;

    const initializeProduct = async () => {
      // Initialize editor (plugins, UI, actions)
      await initProductEditor(cesdk);

      // Set up default product scene
      const defaultProduct = PRODUCT_SAMPLES[0];
      const defaultColor =
        defaultProduct.colors.find((color) => color.isDefault) ||
        defaultProduct.colors[0];

      await setupProductScene(cesdk, defaultProduct, defaultColor);

      // Switch to first area
      await switchArea(cesdk, defaultProduct.areas[0].id);

      // Update React state
      setProductId(defaultProduct.id);
      setColor(defaultColor);
      setIsInitialized(true);
    };

    initializeProduct();
  }, [cesdk, isInitialized]);

  // ============================================================================
  // Callbacks
  // ============================================================================

  const handleProductChange = async (
    product: ProductConfig,
    newColor: ProductColor
  ) => {
    if (!cesdk) return;

    setProductId(product.id);
    setColor(newColor);

    // Set up new product scene
    await setupProductScene(cesdk, product, newColor);

    // Switch to first area
    await switchArea(cesdk, product.areas[0].id);
  };

  const handleColorChange = async (newColor: ProductColor) => {
    if (!cesdk) return;

    // Get current product from state or metadata
    let product = PRODUCT_SAMPLES.find((sample) => sample.id === productId);
    if (!product) {
      const scene = cesdk.engine.scene.get();
      if (scene != null) {
        const productData = cesdk.engine.block.getMetadata(scene, 'product');
        if (productData) {
          product = JSON.parse(productData) as ProductConfig;
        }
      }
    }
    if (!product) return;

    setColor(newColor);

    // Update backdrops with new color
    updateProductColor(cesdk, product, newColor);

    // Refresh view
    const areaId = getVisibleAreaId(cesdk.engine) || product.areas[0].id;
    await switchArea(cesdk, areaId);
  };

  const handleExportRequest = async () => {
    if (!cesdk) return;
    // Use the downloadDesignData action which handles
    // exporting and downloading all product areas as PDFs and thumbnails
    await cesdk.actions.run('downloadDesignData');
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={styles.app}>
      {children}
      <Sidebar
        productId={productId}
        color={color}
        onProductChange={handleProductChange}
        onColorChange={handleColorChange}
        onExportRequest={handleExportRequest}
      />
    </div>
  );
}
