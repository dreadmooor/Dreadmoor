import React from "react";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { Otagh9 } from "./otagh9/Otagh9";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#00b4d8",
          logoColor2: "#0077b6",
        }}
      />

      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2",
          logoColor2: "#86A8E7",
        }}
      />

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
