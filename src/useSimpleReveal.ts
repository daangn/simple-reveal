import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import * as css from "./useSimpleReveal.css";

const DEFAULT_DELAY = 0;
const DEFAULT_DURATION = 500;
const DEFAULT_INITIAL_TRANSFORM = "translateY(1rem)";

function getVarName(variable: string) {
  const matches = variable.match(/^var\((.*)\)$/);
  return matches ? matches[1] : variable;
}

function setVars($el: HTMLElement, vars: { [key: string]: string }) {
  Object.entries(vars).forEach(([key, value]) => {
    $el.style.setProperty(getVarName(key), value);
  });
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

export function useSimpleReveal(param?: {
  delay?: number;
  duration?: number;
  initialTransform?: string;
}): {
  ref: React.RefObject<any>;
  cn: (base?: string) => string;
} {
  const delay = param?.delay ?? DEFAULT_DELAY;
  const duration = param?.duration ?? DEFAULT_DURATION;
  const initialTransform = param?.initialTransform ?? DEFAULT_INITIAL_TRANSFORM;

  const mounted = useMounted();

  const [revealed, reveal] = useReducer(() => true, false);
  const [delayIgnored, ignoreDelay] = useReducer(() => true, false);

  const ref = useRef<any>(null);

  useEffectWithRefCurrent(
    ref,
    (current) => {
      setVars(current, {
        [css.vars.delay]: delayIgnored ? "0ms" : `${delay}ms`,
        [css.vars.duration]: `${duration}ms`,
        [css.vars.initialTransform]: initialTransform,
      });
    },
    [duration, delayIgnored, delay, initialTransform]
  );

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
      });
      obs.observe(current);

      return () => {
        obs.unobserve(current);
      };
    },
    []
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

  return useMemo(
    () => ({
      ref,
      cn,
    }),
    [ref, cn]
  );
}
