import { useCallback } from "react";

export const useMessage = () => {
  return useCallback((html) => {
    if (window.M && html) {
        window.M.toast({ html })
    }
  }, []);
};
