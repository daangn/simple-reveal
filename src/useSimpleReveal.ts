import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import * as css from "./useSimpleReveal.css";

const DEFAULT_DELAY = 0;
const DEFAULT_DURATION = 500;
const DEFAULT_INITIAL_TRANSFORM = "translateY(1rem)";

function getVarName(variable: string) {
  const matches = variable.match(/^var\((.*)\)$/);
  return matches ? matches[1] : variable;
}

function useEffectWithRefCurrent<T extends HTMLElement>(
  ref: React.RefObject<T>,
  cb: (current: T) => (() => void) | void,
  deps: any[]
) {
  useEffect(() => (ref.current ? cb(ref.current) : () => {}), [ref, ...deps]);
}

function useMounted() {
  const [mounted, mount] = useReducer(() => true, false);

  useEffect(() => {
    mount();
  }, [mount]);

  return mounted;
}

export function useSimpleReveal(params?: {
  delay?: number;
  duration?: number;
  initialTransform?: string;
  rootMargin?: string;
}): {
  ref: React.RefObject<any>;
  cn: (base?: string) => string;
  style: React.CSSProperties;
} {
  const delay = params?.delay ?? DEFAULT_DELAY;
  const duration = params?.duration ?? DEFAULT_DURATION;
  const initialTransform =
    params?.initialTransform ?? DEFAULT_INITIAL_TRANSFORM;

  const mounted = useMounted();

  const [revealed, reveal] = useReducer(() => true, false);
  const [delayIgnored, ignoreDelay] = useReducer(() => true, false);

  const ref = useRef<any>(null);

  useEffectWithRefCurrent(
    ref,
    (current) => {
      const onScroll: IntersectionObserverCallback = ([e]) => {
        if (e.isIntersecting) {
          reveal();
        } else if (!mounted) {
          ignoreDelay();
        }
      };

      const obs = new IntersectionObserver(onScroll, {
        threshold: [0],
        rootMargin: params?.rootMargin,
      });
      obs.observe(current);

      return () => {
        obs.unobserve(current);
      };
    },
    [mounted]
  );

  const cn = useCallback(
    (base?: string): string => {
      const baseClassList = base ? base.split(" ") : [];
      const classNames = [...baseClassList, css.themeClass, css.base];

      if (revealed) {
        classNames.push(css.revealed);
      }

      return classNames.join(" ");
    },
    [revealed]
  );

  const style = useMemo<React.CSSProperties>(
    () => ({
      [getVarName(css.vars.delay)]: delayIgnored ? "0ms" : `${delay}ms`,
      [getVarName(css.vars.duration)]: `${duration}ms`,
      [getVarName(css.vars.initialTransform)]: initialTransform,
    }),
    [delayIgnored, delay, duration, initialTransform]
  );

  return useMemo(
    () => ({
      ref,
      cn,
      style,
    }),
    [ref, cn]
  );
}
