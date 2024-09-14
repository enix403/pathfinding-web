export const isProduction = () => import.meta.env.PROD;

export function delay(ms: number): Promise<void> {
  if (ms === 0) return Promise.resolve();
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
