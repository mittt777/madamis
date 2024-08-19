import { useState } from "react";

export const Component = () => {
  const [c, uc] = useState(0);

  return (
    <button
      onClick={() => {
        uc(c + 1);
      }}
    >
      {c}
    </button>
  );
};
