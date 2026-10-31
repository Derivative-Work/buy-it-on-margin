import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const FACES: [string, string, string][] = [
  ['Limelight', 'fonts/Limelight-Regular.ttf', 'normal'],
  ['Old Standard TT', 'fonts/OldStandard-Regular.ttf', 'normal'],
  ['Old Standard TT', 'fonts/OldStandard-Italic.ttf', 'italic'],
];

/** Loads the card fonts (SIL OFL, public/fonts) and holds the render until they are ready. */
export const Fonts: React.FC = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(FACES.map(([family, file, style]) => {
      const f = new FontFace(family, `url(${staticFile(file)})`, {style});
      return f.load().then((loaded) => document.fonts.add(loaded));
    })).then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
  }, [handle]);
  return null;
};
