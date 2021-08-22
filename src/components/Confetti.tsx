import React from 'react';
import useWindowDimensions from '../utility/WindowSize';
import Confetti from 'react-confetti';

export default () => {
  const { width, height } = useWindowDimensions();
  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
    />
  )
}
