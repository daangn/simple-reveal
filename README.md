# SimpleReveal

![](https://img.shields.io/npm/v/simple-reveal)
![](https://img.shields.io/npm/l/simple-reveal)
![](https://img.shields.io/npm/dt/simple-reveal)
![](https://img.shields.io/github/contributors/daangn/simple-reveal)
![](https://img.shields.io/github/last-commit/daangn/simple-reveal)

A simple scroll animation library in React

- Zero-dependency
- No additional DOM element
- Simple and predictable API
- SSR Support (Next.js, Gatsby)
- Automatically compensates transition delay
  - The delay only works when it is first revealed, and disables the delay when it is revealed when scrolling.
- TypeScript Support
- Respect `@media (prefers-reduced-motion)`

## Demo

[![Edit SimpleReveal Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/simplereveal-demo-xzmf57?fontsize=14&hidenavigation=1&theme=dark)

## Getting started

```bash
$ yarn add simple-reveal
```

## How to use

If you have a component like this:

```tsx
import React from "react";

const MyComponent: React.FC = () => {
  return (
    <div>
      <h1 className="title">I want to put a reveal animation here</h1>
    </div>
  );
};
```

You can add animations using `<SimpleReveal />` component like this:

```tsx
import "simple-reveal/index.css";

import React from "react";
import { SimpleReveal } from "simple-reveal";

const MyComponent: React.FC = () => {
  return (
    <div>
      <SimpleReveal
        render={({ ref, cn, style }) => (
          <h1 ref={ref} className={cn("title")} style={style}>
            I want to put a reveal animation here
          </h1>
        )}
        // options (optional)
        duration={500}
        delay={0}
        initialTransform="translateY(1rem)"
      />
    </div>
  );
};
```

Or you can use animation using `useSimpleReveal()` hook like this:

```tsx
import "simple-reveal/index.css";

import React from "react";
import { useSimpleReveal } from "simple-reveal";

const MyComponent: React.FC = () => {
  const { ref, cn, style } = useSimpleReveal({
    duration: 500,
    delay: 0,
    initialTransform: "translateY(1rem)",
  });

  return (
    <div>
      <h1 ref={ref} className={cn("title")} style={style}>
        I want to put a reveal animation here
      </h1>
    </div>
  );
};
```

## Contributors

- [Tony](https://github.com/tonyfromundefined)
