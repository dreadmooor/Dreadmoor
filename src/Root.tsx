import React from 'react';
import { Composition } from 'remotion';
import { Demo } from './demo/Demo';
import { Otagh9 } from './otagh9/Otagh9';
import './fonts';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Otagh9"
        component={Otagh9}
        durationInFrames={1080}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Demo"
        component={Demo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
