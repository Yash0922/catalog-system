// Performance monitoring utilities

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Lazy loading utility for images
export const lazyLoadImage = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = reject;
        img.src = src;
    });
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: IntersectionObserverInit
) => {
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        return null;
    }

    return new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
    });
};

// Memory usage monitoring (for development)
export const logMemoryUsage = () => {
    if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory Usage:', {
            used: `${Math.round(memory.usedJSHeapSize / 1048576)} MB`,
            total: `${Math.round(memory.totalJSHeapSize / 1048576)} MB`,
            limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)} MB`,
        });
    }
};

// Type definitions for performance entries
interface PerformanceEventTiming extends PerformanceEntry {
    processingStart?: number;
    processingEnd?: number;
}

// Web Vitals monitoring
export const measureWebVitals = () => {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP measurement not supported');
        }

        // First Input Delay
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    const eventEntry = entry as PerformanceEventTiming;
                    if (eventEntry.processingStart && eventEntry.startTime) {
                        console.log('FID:', eventEntry.processingStart - eventEntry.startTime);
                    }
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID measurement not supported');
        }

        // Cumulative Layout Shift
        try {
            const observer = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS measurement not supported');
        }
    }
};

// Bundle size analyzer (for development)
export const analyzeBundleSize = () => {
    if (process.env.NODE_ENV === 'development') {
        const scripts = document.querySelectorAll('script[src]');
        let totalSize = 0;

        scripts.forEach(async (script) => {
            const src = (script as HTMLScriptElement).src;
            if (src.includes('localhost')) {
                try {
                    const response = await fetch(src);
                    const size = parseInt(response.headers.get('content-length') || '0');
                    totalSize += size;
                    console.log(`Script ${src}: ${(size / 1024).toFixed(2)} KB`);
                } catch (e) {
                    console.warn('Could not fetch script size for:', src);
                }
            }
        });

        setTimeout(() => {
            console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
        }, 1000);
    }
};

// Error boundary utility
export const logError = (error: Error, errorInfo?: any) => {
    console.error('Application Error:', error);
    if (errorInfo) {
        console.error('Error Info:', errorInfo);
    }

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
        // Example: Sentry.captureException(error);
    }
};