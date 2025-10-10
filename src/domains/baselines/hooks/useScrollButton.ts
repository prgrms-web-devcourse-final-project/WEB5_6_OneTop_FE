import { useState, useEffect } from "react";
import type { ScrollButtonState } from "../types";

export const useScrollButton = (footerHeight: number): ScrollButtonState => {
  const [bottomPosition, setBottomPosition] = useState(30);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom <= footerHeight) {
        const adjustment =
          ((footerHeight - distanceFromBottom) / footerHeight) * 70;
        setBottomPosition(30 + adjustment);
      } else {
        setBottomPosition(30);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerHeight]);

  return { bottomPosition };
};
