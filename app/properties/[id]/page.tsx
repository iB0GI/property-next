'use client';
import React from "react";

interface Props {
  params: Promise<{ id?: string }>;
}

const PropertyPage = async (props: Props) => {
  const params = await props.params;

  const { id } = params;
  return <div> Property {id}</div>;
};

export default PropertyPage;
