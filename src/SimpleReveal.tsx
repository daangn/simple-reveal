import React, { useEffect, useReducer, useRef } from "react";

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

interface SimpleRevealProps {
  render: (
    ref: React.RefObject<any>,
    className: (n: string) => string
  ) => React.ReactNode;
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
  const [revealed, reveal] = useReducer(() => true, false);
  const [delayIgnored, ignoreDelay] = useReducer(() => true, false);

  const [mounted, mount] = useReducer(() => true, false);

  useEffect(() => {
    mount();
  }, [mount]);

  const ref = useRef<any>(null);

  useEffect(() => {
    const $el = ref.current;

    if (!$el) {
      return;
    }

    setVars($el, {
      [css.vars.delay]: delayIgnored ? "0ms" : `${delay}ms`,
      [css.vars.duration]: `${duration}ms`,
      [css.vars.initialTransform]: initialTransform,
    });
  }, [duration, delayIgnored, delay, initialTransform]);

  useEffect(() => {
    const onScroll: IntersectionObserverCallback = ([e]) => {
      if (e.isIntersecting) {
        reveal();
      }
      if (!mounted && !e.isIntersecting) {
        ignoreDelay();
      }
    };

    const obs = new IntersectionObserver(onScroll, {
      threshold: [0],
    });

    const $el = ref.current;

    if (!$el) {
      return () => {};
    }

    obs.observe($el);

    return () => {
      obs.unobserve($el);
      obs.disconnect();
    };
  }, [ref]);

  const className = (base: string) =>
    [base, css.themeClass, css.base, ...(revealed ? [css.revealed] : [])].join(
      " "
    );

  return <>{render(ref, className)}</>;
};

export default SimpleReveal;
