import React from "react";

import { useSimpleReveal } from "./useSimpleReveal";

type UseSimpleRevealParams = Parameters<typeof useSimpleReveal>[0];
type UseSimpleRevealReturnType = ReturnType<typeof useSimpleReveal>;

interface SimpleRevealProps extends NonNullable<UseSimpleRevealParams> {
  render: (
    args: UseSimpleRevealReturnType
  ) => React.ReactElement<any, any> | null;
}
const SimpleReveal: React.FC<SimpleRevealProps> = (props) =>
  props.render(
    useSimpleReveal({
      ...props,
    })
  );

export default SimpleReveal;
