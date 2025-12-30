// Custom debounce utility function
export const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  const debouncedFunction = (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
  debouncedFunction.cancel = () => clearTimeout(timeout);
  return debouncedFunction;
};
