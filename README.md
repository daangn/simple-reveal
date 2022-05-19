# SimpleReveal

![](https://img.shields.io/npm/v/simple-reveal)
![](https://img.shields.io/npm/l/simple-reveal)
![](https://img.shields.io/npm/dt/simple-reveal)
![](https://img.shields.io/github/contributors/daangn/simple-reveal)
![](https://img.shields.io/github/last-commit/daangn/simple-reveal)

A simple scroll animation library

- Zero-dependency
- No additional DOM element
- Simple and predictable API
- SSR Support (Next.js, Gatsby)
- Automatically compensates transition delay
  - The delay only works when it is first revealed, and disables the delay when it is revealed when scrolling.
- TypeScript Support

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

You can add animations using `<SimpleReveal />` like this:

```tsx
import React from "react";
import { SimpleReveal } from "simple-reveal";

const MyComponent: React.FC = () => {
  return (
    <div>
      <SimpleReveal
        render={(ref, className) => (
          <h1 ref={ref} className={className("title")}>
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

## Contributors

- [Tony](https://github.com/tonyfromundefined)
