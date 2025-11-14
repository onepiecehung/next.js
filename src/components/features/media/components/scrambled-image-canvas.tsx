'use client';

import { MediaAPI } from '@/lib/api/media';
import { cn, generatePermutation } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

/**
 * Props for the ScrambledImageCanvas component
 */
interface ScrambledImageCanvasProps {
  /** Unique identifier of the media item */
  mediaId: string;
  /** URL of the scrambled image from the backend */
  src: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** Additional CSS classes */
  className?: string;
  /** Maximum width constraint */
  maxWidth?: number;
  /** Maximum height constraint */
  maxHeight?: number;
  /** Enable tile-by-tile animation (default: true) */
  animate?: boolean;
  /** Animation duration in milliseconds (default: 1500) */
  animationDuration?: number;
  /** Stagger delay between tiles in milliseconds (default: 5) */
  staggerDelay?: number;
}

/**
 * ScrambledImageCanvas Component
 *
 * Client component that reconstructs the original image from scrambled tiles.
 * Uses canvas to render the unscrambled image by rearranging tiles according to
 * the permutation seed fetched from the backend.
 */
export function ScrambledImageCanvas({
  mediaId,
  src,
  alt,
  className,
  maxWidth,
  maxHeight,
  animate = true,
  animationDuration = 1500,
  staggerDelay = 5,
}: ScrambledImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Image dimensions for potential future use (e.g., responsive sizing)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  // Animation progress (0-1) for potential future use (e.g., progress indicator)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    /**
     * Async function to load and unscramble the image
     */
    async function loadAndUnscrambleImage() {
      try {
        setLoading(true);
        setError(null);

        // Wait for canvas to be mounted with retry logic
        // This is important because without DevTools, code runs faster and canvas might not be ready
        let retries = 0;
        const maxRetries = 10;
        while (!canvasRef.current && retries < maxRetries) {
          await new Promise<void>((resolve) => {
            // Wait for multiple frames to ensure canvas is fully rendered
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  resolve();
                });
              });
            });
          });
          retries++;
        }

        if (cancelled) return;

        // Verify canvas ref is available
        if (!canvasRef.current) {
          throw new Error('Canvas element not mounted after retries. Please ensure the component is properly rendered.');
        }

        // Additional check: ensure canvas has valid dimensions
        if (canvasRef.current && (canvasRef.current.width === 0 || canvasRef.current.height === 0)) {
          // Wait a bit more for canvas to be properly initialized
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Step 1: Fetch scramble key from backend
        const scrambleKeyResponse = await MediaAPI.getScrambleKey(mediaId);

        if (cancelled) return;

        if (!scrambleKeyResponse.success) {
          throw new Error(
            scrambleKeyResponse.message || 'Failed to fetch scramble key'
          );
        }

        const { permutationSeed, tileRows, tileCols } = scrambleKeyResponse.data;

        console.log('🔑 Scramble Key Data:', {
          permutationSeed: permutationSeed.substring(0, 20) + '...',
          tileRows,
          tileCols,
          totalTiles: tileRows * tileCols
        });

        // Step 2: Generate permutation mapping
        const { inversePermutation } = generatePermutation(
          permutationSeed,
          tileRows,
          tileCols
        );

        console.log('🔀 Permutation generated:', {
          length: inversePermutation.length,
          firstFew: inversePermutation.slice(0, 5),
          lastFew: inversePermutation.slice(-5)
        });

        // Step 3: Load the scrambled image
        console.log('Loading scrambled image from:', src);

        // Get current frontend origin
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
        const isLocalhost3000 = currentOrigin === 'http://localhost:3000';
        const isLocalhost3001 = currentOrigin === 'http://localhost:3001';
        const isAllowedOrigin = isLocalhost3000 || isLocalhost3001;
        const isHttps = src.startsWith('https://');

        console.log('CORS Analysis:', {
          imageUrl: src,
          frontendOrigin: currentOrigin,
          isLocalhost3000,
          isLocalhost3001,
          isAllowedOrigin,
          isHttps,
          needsCORS: isHttps && !src.includes('localhost')
        });

        // Test CORS configuration first (non-blocking)
        // This is just for diagnostics - we'll still try to load the image even if test fails
        if (isHttps && !src.includes('localhost')) {
          console.log('🔍 Testing CORS configuration...');
          try {
            // Add delay before CORS test to ensure preflight can complete
            // This is critical when DevTools is closed
            await new Promise((resolve) => {
              requestAnimationFrame(() => {
                setTimeout(resolve, 200); // Delay for CORS preflight
              });
            });

            const corsTestResponse = await fetch(src, {
              method: 'HEAD',
              mode: 'cors'
            });
            const corsHeaders = {
              'Access-Control-Allow-Origin': corsTestResponse.headers.get('Access-Control-Allow-Origin'),
              'Access-Control-Allow-Methods': corsTestResponse.headers.get('Access-Control-Allow-Methods'),
              'Access-Control-Allow-Headers': corsTestResponse.headers.get('Access-Control-Allow-Headers'),
              'Access-Control-Max-Age': corsTestResponse.headers.get('Access-Control-Max-Age'),
            };
            console.log('📋 CORS Test Response Headers:', corsHeaders);
            
            // Validate CORS configuration
            if (!corsHeaders['Access-Control-Allow-Origin']) {
              console.warn('⚠️ No CORS headers detected in test!');
              console.warn('   → CDN CORS may not be configured or not yet propagated.');
              console.warn('   → Will still attempt to load image...');
            } else if (corsHeaders['Access-Control-Allow-Origin'] !== currentOrigin && corsHeaders['Access-Control-Allow-Origin'] !== '*') {
              console.warn('⚠️ CORS origin mismatch:', {
                expected: currentOrigin,
                received: corsHeaders['Access-Control-Allow-Origin'],
                suggestion: `Add "${currentOrigin}" to AllowedOrigins in R2 CORS config`
              });
            } else {
              console.log('✅ CORS origin matches:', corsHeaders['Access-Control-Allow-Origin']);
            }

            // Check for OPTIONS method
            const allowedMethods = corsHeaders['Access-Control-Allow-Methods']?.toUpperCase() || '';
            if (!allowedMethods.includes('OPTIONS')) {
              console.warn('⚠️ OPTIONS method not found in AllowedMethods!');
              console.warn('   → Browser preflight requests may fail.');
            } else {
              console.log('✅ OPTIONS method is allowed');
            }

            // Check for headers
            const allowedHeaders = corsHeaders['Access-Control-Allow-Headers'] || '';
            if (!allowedHeaders || allowedHeaders === '') {
              console.warn('⚠️ AllowedHeaders is empty.');
            } else {
              console.log('✅ AllowedHeaders configured:', allowedHeaders);
            }

            // Check Max-Age
            if (corsHeaders['Access-Control-Max-Age']) {
              console.log('✅ CORS Max-Age:', corsHeaders['Access-Control-Max-Age'], 'seconds');
            }
          } catch (corsTestError) {
            const error = corsTestError as Error;
            console.warn('⚠️ CORS test failed (non-blocking):', error.message);
            console.warn('   → Will still attempt to load image...');
            console.warn('   → If image load fails, check R2 CORS configuration.');
          }
        }

        // Load image using fetch() + blob approach for better CORS handling
        // This approach is more reliable than Image() element when DevTools is closed
        // because fetch() handles CORS preflight more predictably
        const img = new Image();
        let corsAttempted = false;
        let imageBlobUrl: string | null = null;
        let useDirectLoad = false;

        if (isHttps && !src.includes('localhost')) {
          // External HTTPS URL - try fetch() first, fallback to direct load if it fails
          corsAttempted = true;
          console.log('🌐 Attempting to load image via fetch() for better CORS handling...');
          console.log('   CDN should allow CORS from:', currentOrigin);
          console.log('   Image URL:', src);
          
          // CRITICAL: Pre-warm CORS before first fetch attempt
          // This is essential when DevTools is closed (code runs faster)
          // We need to ensure CORS preflight completes before actual fetch
          console.log('⏳ Pre-warming CORS before fetch...');
          
          // Strategy: Use a small test fetch to trigger and wait for CORS preflight
          // This ensures the browser has processed CORS before we do the actual fetch
          let preflightReady = false;
          let preflightAttempts = 0;
          const maxPreflightAttempts = 5;
          
          while (!preflightReady && preflightAttempts < maxPreflightAttempts) {
            preflightAttempts++;
            console.log(`🔄 Pre-warming CORS (attempt ${preflightAttempts}/${maxPreflightAttempts})...`);
            
            try {
              // Make a small HEAD request to trigger CORS preflight
              const preflightStartTime = performance.now();
              const preflightResponse = await fetch(src, {
                method: 'HEAD',
                mode: 'cors',
                credentials: 'omit',
                cache: 'no-cache' // Force fresh request
              });
              const preflightDuration = performance.now() - preflightStartTime;
              
              // Check if we got CORS headers
              const corsHeader = preflightResponse.headers.get('access-control-allow-origin');
              if (corsHeader) {
                console.log(`✅ CORS preflight completed (${preflightDuration.toFixed(2)}ms) - Headers present`);
                preflightReady = true;
              } else {
                console.warn(`⚠️ CORS preflight response received but no CORS headers (${preflightDuration.toFixed(2)}ms)`);
                // Wait a bit and retry
                await new Promise((resolve) => setTimeout(resolve, 200 * preflightAttempts));
              }
            } catch (preflightError) {
              const error = preflightError as Error;
              console.warn(`⚠️ CORS preflight attempt ${preflightAttempts} failed:`, error.message);
              
              // If it's a CORS error, wait and retry - the preflight might still be processing
              if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                // Wait longer between retries to give browser time to process
                await new Promise((resolve) => {
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setTimeout(() => {
                        resolve(undefined);
                      }, 500 * preflightAttempts); // Increasing delay
                    });
                  });
                });
              } else {
                // Other errors, break and continue
                break;
              }
            }
          }
          
          // Additional delay to ensure preflight is fully processed by browser
          // This is critical when DevTools is closed (code runs faster)
          // Multiple animation frames + timeout to ensure browser processes CORS
          console.log('⏳ Final delay to ensure CORS is fully processed...');
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    setTimeout(() => {
                      resolve(undefined);
                    }, 500); // Increased delay for better reliability
                  });
                });
              });
            });
          });
          console.log('✅ Ready to fetch image...');
          
          let fetchAttempts = 0;
          const maxFetchAttempts = 3;
          let fetchSuccess = false;

          while (!fetchSuccess && fetchAttempts < maxFetchAttempts) {
            fetchAttempts++;
            
            if (fetchAttempts > 1) {
              console.log(`🔄 Retrying fetch (attempt ${fetchAttempts}/${maxFetchAttempts})...`);
              // Increase delay between retries
              await new Promise((resolve) => setTimeout(resolve, 1000 * fetchAttempts));
            }

            try {
              console.log(`📡 Fetching image (attempt ${fetchAttempts})...`);
              const fetchStartTime = performance.now();
              
              const response = await fetch(src, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit', // Don't send cookies
                cache: 'default'
              });

              const fetchDuration = performance.now() - fetchStartTime;
              console.log(`📥 Fetch response received (${fetchDuration.toFixed(2)}ms):`, {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: {
                  'content-type': response.headers.get('content-type'),
                  'content-length': response.headers.get('content-length'),
                  'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                }
              });

              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }

              const blobStartTime = performance.now();
              const blob = await response.blob();
              const blobDuration = performance.now() - blobStartTime;
              console.log(`📦 Blob created (${blobDuration.toFixed(2)}ms):`, {
                size: blob.size,
                type: blob.type
              });

              imageBlobUrl = URL.createObjectURL(blob);
              blobUrlRef.current = imageBlobUrl; // Store for cleanup
              console.log(`✅ Image fetched successfully (attempt ${fetchAttempts})`);
              console.log(`   Blob URL created: ${imageBlobUrl.substring(0, 50)}...`);
              fetchSuccess = true;
            } catch (fetchError) {
              const error = fetchError as Error;
              console.error(`❌ Fetch attempt ${fetchAttempts} failed:`, {
                message: error.message,
                name: error.name,
                stack: error.stack?.split('\n').slice(0, 3).join('\n')
              });
              
              if (fetchAttempts >= maxFetchAttempts) {
                console.warn('⚠️ All fetch attempts failed, will fallback to direct image load');
                console.warn('   Last error:', error.message);
                useDirectLoad = true;
                break; // Exit loop, will use direct load
              }
            }
          }
        } else {
          console.log('No CORS needed - localhost or HTTP URL, using direct load');
          useDirectLoad = true;
        }

        // Load image into Image element
        // If we used fetch(), use the blob URL; otherwise use original src with crossOrigin
        const imageSrc = imageBlobUrl || src;
        
        if (useDirectLoad && isHttps && !src.includes('localhost')) {
          // For direct load, we need crossOrigin set BEFORE src
          // CRITICAL: When DevTools is closed, code runs faster and CORS preflight
          // may not complete before image load. We need to ensure preflight completes.
          console.log('🖼️ Using direct image load with crossOrigin="anonymous"');
          img.crossOrigin = 'anonymous';
          
          // CRITICAL FIX: Pre-warm CORS by making a preflight request
          // This ensures CORS preflight completes before we set img.src
          // This is essential when DevTools is closed (code runs faster)
          console.log('⏳ Pre-warming CORS preflight for direct image load...');
          try {
            // Make a HEAD request to trigger CORS preflight
            await fetch(src, {
              method: 'HEAD',
              mode: 'cors',
              credentials: 'omit'
            });
            console.log('✅ CORS preflight completed');
          } catch (preflightError) {
            console.warn('⚠️ CORS preflight failed, but continuing...', preflightError);
          }
          
          // Additional delay to ensure preflight is fully processed
          // Multiple animation frames + timeout to ensure browser processes CORS
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  // Additional delay - critical when DevTools is closed
                  setTimeout(() => {
                    resolve(undefined);
                  }, 500); // Increased delay to 500ms
                });
              });
            });
          });
          console.log('⏳ Delay completed, ready to load image');
        } else if (imageBlobUrl) {
          console.log('🖼️ Using blob URL (no crossOrigin needed)');
        } else {
          console.log('🖼️ Using direct image load (no CORS needed)');
        }
        
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            if (imageBlobUrl) {
              URL.revokeObjectURL(imageBlobUrl);
              blobUrlRef.current = null;
            }
            reject(new Error(`Image load timeout after 15 seconds: ${src}`));
          }, 15000); // Increased timeout to 15 seconds

          img.onload = () => {
            clearTimeout(timeout);
            console.log('✅ Image loaded into Image element:', {
              width: img.naturalWidth,
              height: img.naturalHeight,
              complete: img.complete,
              source: imageBlobUrl ? 'blob URL' : 'direct URL',
              crossOrigin: img.crossOrigin || 'none'
            });
            // Small delay to ensure image is fully decoded
            // This is especially important when DevTools is closed
            setTimeout(() => {
              resolve();
            }, 100); // Increased delay for better stability
          };

          img.onerror = (e) => {
            clearTimeout(timeout);
            if (imageBlobUrl) {
              URL.revokeObjectURL(imageBlobUrl);
              blobUrlRef.current = null;
            }
            console.error('❌ Image load error:', e);
            console.error('Failed URL:', src);
            console.error('Image source:', imageBlobUrl ? 'blob URL' : 'direct URL');
            console.error('crossOrigin:', img.crossOrigin || 'none');
            console.error('useDirectLoad:', useDirectLoad);
            
            let corsMessage = '';
            if (corsAttempted && useDirectLoad) {
              corsMessage = `\n\n🔴 CORS CONFIGURATION REQUIRED:\n`;
              corsMessage += `\nThe CDN (R2) is NOT sending CORS headers. This is why the image cannot be loaded into canvas.\n`;
              corsMessage += `\n📋 REQUIRED R2 CORS CONFIGURATION:\n`;
              corsMessage += `[\n`;
              corsMessage += `  {\n`;
              corsMessage += `    "AllowedOrigins": ["http://localhost:3000", "http://localhost:3001"],\n`;
              corsMessage += `    "AllowedMethods": ["GET", "HEAD", "OPTIONS"],\n`;
              corsMessage += `    "AllowedHeaders": ["*"],\n`;
              corsMessage += `    "MaxAgeSeconds": 3600\n`;
              corsMessage += `  }\n`;
              corsMessage += `]\n`;
              corsMessage += `\n📝 STEPS TO FIX:\n`;
              corsMessage += `1. Go to Cloudflare R2 Dashboard\n`;
              corsMessage += `2. Select your bucket\n`;
              corsMessage += `3. Go to Settings > CORS Policy\n`;
              corsMessage += `4. Paste the JSON config above\n`;
              corsMessage += `5. Save and wait 1-5 minutes for propagation\n`;
              corsMessage += `6. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)\n`;
              corsMessage += `\n⚠️ NOTE: When DevTools is open, browser may bypass CORS in some cases.\n`;
              corsMessage += `   But for canvas operations, CORS headers are REQUIRED.\n`;
              corsMessage += `   The R2 CORS config MUST be set correctly.\n`;
            }

            reject(new Error(`Failed to load image into Image element from ${src}.${corsMessage}`));
          };

          console.log(`📸 Setting img.src to: ${imageBlobUrl ? 'blob URL' : src}`);
          img.src = imageSrc;
        });

        if (cancelled) return;

        const scrambledWidth = img.naturalWidth;
        const scrambledHeight = img.naturalHeight;

        console.log('📐 Image dimensions:', {
          width: scrambledWidth,
          height: scrambledHeight,
          tileRows,
          tileCols,
          expectedTiles: tileRows * tileCols,
          actualTiles: inversePermutation.length
        });

        // Validate dimensions
        if (scrambledWidth <= 0 || scrambledHeight <= 0) {
          throw new Error(`Invalid image dimensions: ${scrambledWidth}x${scrambledHeight}`);
        }

        if (tileRows <= 0 || tileCols <= 0) {
          throw new Error(`Invalid tile configuration: ${tileRows} rows x ${tileCols} cols`);
        }

        // Step 4: Calculate tile dimensions
        // Use exact division to match backend behavior
        const tileWidth = Math.floor(scrambledWidth / tileCols);
        const tileHeight = Math.floor(scrambledHeight / tileRows);

        console.log('🧩 Tile dimensions:', {
          tileWidth,
          tileHeight,
          totalWidth: tileWidth * tileCols,
          totalHeight: tileHeight * tileRows,
          widthRemainder: scrambledWidth % tileCols,
          heightRemainder: scrambledHeight % tileRows,
          widthMatch: tileWidth * tileCols === scrambledWidth,
          heightMatch: tileHeight * tileRows === scrambledHeight
        });

        // Warn if dimensions don't match exactly (may cause issues)
        if (tileWidth * tileCols !== scrambledWidth || tileHeight * tileRows !== scrambledHeight) {
          console.warn('⚠️ Image dimensions do not divide evenly by tiles. Some pixels may be lost.');
        }

        // Step 5: Set up canvas for unscrambled image
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error('Canvas element was unmounted during image processing. Please try again.');
        }

        const canvasWidth = tileWidth * tileCols;
        const canvasHeight = tileHeight * tileRows;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Store dimensions for responsive rendering
        setImageDimensions({ width: canvasWidth, height: canvasHeight });

        // Small delay to ensure canvas dimensions are applied
        // This is critical when DevTools is closed (code runs faster)
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              resolve(undefined);
            });
          });
        });

        if (cancelled) return;

        // Step 6: Get canvas context and render unscrambled image
        const ctx = canvas.getContext('2d', {
          willReadFrequently: false,
          alpha: true
        });
        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        // Disable image smoothing for pixel-perfect tile rendering
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = 'low';

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        console.log('🎨 Starting to draw tiles...');
        console.log('Canvas setup:', {
          canvasWidth,
          canvasHeight,
          totalTiles: inversePermutation.length,
          animate,
          animationDuration,
          staggerDelay
        });

        // Prepare tile data for drawing
        interface TileData {
          scrambledIndex: number;
          originalIndex: number;
          sx: number;
          sy: number;
          dx: number;
          dy: number;
        }

        const tiles: TileData[] = [];
        let tilesSkipped = 0;

        // Pre-calculate all tile positions
        for (let scrambledIndex = 0; scrambledIndex < inversePermutation.length; scrambledIndex++) {
          const originalIndex = inversePermutation[scrambledIndex];

          // Validate indices
          if (originalIndex < 0 || originalIndex >= inversePermutation.length) {
            console.warn(`⚠️ Invalid originalIndex ${originalIndex} for scrambledIndex ${scrambledIndex}`);
            tilesSkipped++;
            continue;
          }

          // Calculate source position (from scrambled image)
          const srcRow = Math.floor(scrambledIndex / tileCols);
          const srcCol = scrambledIndex % tileCols;

          // Calculate destination position (in original layout)
          const destRow = Math.floor(originalIndex / tileCols);
          const destCol = originalIndex % tileCols;

          const sx = srcCol * tileWidth;
          const sy = srcRow * tileHeight;
          const dx = destCol * tileWidth;
          const dy = destRow * tileHeight;

          // Validate coordinates
          if (sx < 0 || sy < 0 || sx + tileWidth > scrambledWidth || sy + tileHeight > scrambledHeight) {
            tilesSkipped++;
            continue;
          }

          if (dx < 0 || dy < 0 || dx + tileWidth > canvasWidth || dy + tileHeight > canvasHeight) {
            tilesSkipped++;
            continue;
          }

          tiles.push({
            scrambledIndex,
            originalIndex,
            sx,
            sy,
            dx,
            dy,
          });
        }

        console.log(`Prepared ${tiles.length} tiles for drawing${tilesSkipped > 0 ? ` (${tilesSkipped} skipped)` : ''}`);

        // Draw tiles with or without animation
        if (animate && tiles.length > 0) {
          // Animated drawing
          // Small delay before starting animation to ensure everything is ready
          // This is critical when DevTools is closed (code runs faster)
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                resolve(undefined);
              });
            });
          });

          if (cancelled) return;

          const startTime = performance.now();

          const drawFrame = (currentTime: number) => {
            if (cancelled) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            const elapsed = currentTime - startTime;

            // Draw each tile with fade-in animation
            for (let i = 0; i < tiles.length; i++) {
              const tile = tiles[i];
              
              // Calculate when this tile should start animating (staggered)
              const tileStartTime = i * staggerDelay;
              const tileElapsed = elapsed - tileStartTime;

              if (tileElapsed < 0) {
                // Tile hasn't started animating yet
                continue;
              }

              // Calculate opacity (0 to 1) using ease-out curve
              let opacity = Math.min(1, tileElapsed / animationDuration);
              // Apply ease-out easing function
              opacity = 1 - Math.pow(1 - opacity, 3);

              if (opacity > 0) {
                // Save context state
                ctx.save();
                
                // Set global alpha for fade effect
                ctx.globalAlpha = opacity;
                
                // Draw the tile
                ctx.drawImage(
                  img,
                  tile.sx, tile.sy, tileWidth, tileHeight, // Source rectangle
                  tile.dx, tile.dy, tileWidth, tileHeight  // Destination rectangle
                );
                
                // Restore context state
                ctx.restore();
              }
            }

            // Update animation progress
            const totalDuration = tiles.length * staggerDelay + animationDuration;
            const progress = Math.min(1, elapsed / totalDuration);
            setAnimationProgress(progress);

            // Check if animation is complete
            const lastTileStartTime = (tiles.length - 1) * staggerDelay;
            if (elapsed >= lastTileStartTime + animationDuration) {
              // Draw all tiles at full opacity to ensure nothing is missing
              ctx.clearRect(0, 0, canvasWidth, canvasHeight);
              for (const tile of tiles) {
                ctx.drawImage(
                  img,
                  tile.sx, tile.sy, tileWidth, tileHeight,
                  tile.dx, tile.dy, tileWidth, tileHeight
                );
              }
              setAnimationProgress(1);
              setLoading(false);
              console.log(`✅ Animation complete: ${tiles.length} tiles drawn`);
            } else {
              // Continue animation
              animationFrameRef.current = requestAnimationFrame(drawFrame);
            }
          };

          // Start animation
          animationFrameRef.current = requestAnimationFrame(drawFrame);
        } else {
          // Non-animated drawing (instant)
          const startTime = performance.now();
          
          for (const tile of tiles) {
            ctx.drawImage(
              img,
              tile.sx, tile.sy, tileWidth, tileHeight,
              tile.dx, tile.dy, tileWidth, tileHeight
            );
          }

          const endTime = performance.now();
          const duration = endTime - startTime;

          console.log(`✅ Successfully drew ${tiles.length} / ${inversePermutation.length} tiles in ${duration.toFixed(2)}ms`);
          if (tilesSkipped > 0) {
            console.warn(`⚠️ Skipped ${tilesSkipped} tiles due to out-of-bounds errors`);
          }

          setLoading(false);
        }
      } catch (err) {
        const error = err as Error;
        console.error('❌ Failed to unscramble image:', err);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
        if (!cancelled) {
          setError(error?.message ?? 'Unknown error occurred while unscrambling image');
          setLoading(false);
        }
      }
    }

    // Execute the unscrambling process
    loadAndUnscrambleImage();

    // Cleanup function to cancel ongoing operations
    return () => {
      cancelled = true;
      // Cancel animation frame if it's running
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // Revoke blob URL to free memory
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [mediaId, src, animate, animationDuration, staggerDelay]);

  // Always render canvas (even when loading) so ref is available
  // Show skeleton overlay when loading

  // Render error state
  if (error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted/50 border border-destructive/20 rounded-md text-destructive text-sm p-4',
          className
        )}
        style={{
          minHeight: '200px',
          maxWidth: maxWidth || '100%',
        }}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p>Failed to unscramble image</p>
          <p className="text-xs mt-1 opacity-75 break-words">{error}</p>
          <div className="mt-2 text-xs opacity-60">
            <p>Check browser console for detailed error information.</p>
            <p>Note: CDN is configured to allow CORS from localhost:3000 and localhost:3001 only.</p>
          </div>
        </div>
      </div>
    );
  }

  // Always render canvas (even when loading) so ref is available
  // Animation will handle the visual loading state
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
        style={{
          maxWidth: maxWidth || '100%',
          maxHeight: maxHeight || 'auto',
          backgroundColor: loading ? 'transparent' : undefined,
        }}
        aria-label={alt ?? 'Unscrambled image'}
        aria-busy={loading}
      />
      {loading && !animate && (
        // Show subtle loading indicator only if animation is disabled
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <div className="text-xs text-muted-foreground">Loading...</div>
        </div>
      )}
    </div>
  );
}
