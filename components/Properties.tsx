"use client";
import React from "react";
import { Key } from "react";
import PropertyCard from "@/components/PropertyCard";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import PaginationPage from "@/components/Pagination";
const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          `/api/properties?page=${page}&pageSize=${pageSize}`
        );
        if (res.ok) {
          const data = await res.json();
          setProperties(data.properties);
          setTotalItems(data.total);
        } else {
          throw new Error("Failed to fetch properties");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, pageSize]);

  const handlePageChnage = (newPage: number) => {
    setPage(newPage);
  };

  return loading ? (
    <Spinner loading={loading}></Spinner>
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property: any, index: Key | null | undefined) => (
              <PropertyCard property={property} key={index} />
            ))}
          </div>
        )}
        <PaginationPage
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChnage}
        />
      </div>
    </section>
  );
};

export default Properties;
