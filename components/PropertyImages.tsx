import React from "react";
import Image from "next/image";
import { Gallery, Item } from "react-photoswipe-gallery";

const PropertyImages = ({ images }: any) => {
  return (
    <Gallery>
      <section className="bg-blue-50 p.4">
        <div className="container m-auto">
          {images.length === 1 ? (
            <Item
              original={images[0]}
              thumbnail={images[0]}
              width={1000}
              height={600}
            >
              {({ ref, open }) => (
                <Image
                  ref={ref}
                  onClick={open}
                  src={images[0]}
                  alt=""
                  className="object-cover h-[400px] mx-auto rounder-xl"
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority={true}
                />
              )}
            </Item>
          ) : (
            <div className={`grid grid-cols-1 px-1 py-1 sm:grid-cols-2 gap-4`}>
              {images.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`${
                    images.length === 3 && index === 2
                      ? "col-span-1 sm:col-span-2"
                      : "col-span-1"
                  }`}
                >
                  <Item
                    original={image}
                    thumbnail={image}
                    width={1000}
                    height={600}
                  >
                    {({ ref, open }) => (
                      <Image
                        ref={ref}
                        onClick={open}
                        src={image}
                        alt=""
                        className="object-cover h-[400px] w-full rounded-xl"
                        width={0}
                        height={0}
                        sizes="100vw"
                        priority={true}
                      />
                    )}
                  </Item>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Gallery>
  );
};

export default PropertyImages;
