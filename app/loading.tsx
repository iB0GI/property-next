'use client';
import ClipLoader from 'react-spinners/ClipLoader';
import React from "react";

const override = {
  display: 'block',
  margin: '100px auto',
};

const loading = ({ loading }: { loading: boolean }) => {
  return (
    <ClipLoader
      color='#3B82F6'
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label='Loading Spinner'
    />
  );
};
export default loading;