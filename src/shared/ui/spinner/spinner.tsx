'use client';

import { BarLoader } from 'react-spinners';

export const Spinner = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <BarLoader color="#000" loading={true} />
    </div>
  );
};
