import React, { useCallback, useEffect, useReducer, useRef } from "react";

import * as css from "./SimpleReveal.css";

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

interface SimpleRevealProps {
  render: (args: {
    ref: React.RefObject<any>;
    cn: (base?: string) => string;
  }) => React.ReactElement<any, any> | null;
  duration?: number;
  delay?: number;
  initialTransform?: string;
}
const SimpleReveal: React.FC<SimpleRevealProps> = ({
  render,
  duration = 500,
  delay = 0,
  initialTransform = "translateY(1rem)",
}) => {
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

  return render({ ref, cn });
};

export default SimpleReveal;
