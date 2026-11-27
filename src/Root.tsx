import React from "react";
import { Composition } from "remotion";
import { Otagh9 } from "./otagh9/Otagh9";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ۴۹ ثانیه با ۳۰ فریم بر ثانیه = ۱۴۷۰ فریم */}
      <Composition
        id="Otagh9"
        component={Otagh9}
        durationInFrames={1470}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
