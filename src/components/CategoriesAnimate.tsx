"use client";

import { RootState } from "@/store/store";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { useSelector } from "react-redux";
import SkeletonCaterogiesAnimate from "./skeleton/SkeletonCaterogiesAnimate";

const CaterogiesAnimate = () => {
  const { items, loading } = useSelector(
    (state: RootState) => state.comic.catetorys
  );

  if (loading) {
    return <SkeletonCaterogiesAnimate quantity={12} />;
  }

  return (
    <Marquee
      speed={30}
      direction="right"
      gradient={false}
      loop={0}
      pauseOnHover={true}
      pauseOnClick={true}
      style={{ margin: "24px 0" }}
    >
      <div className="flex space-x-3 mr-3 ">
        {items?.map((category: any, index: number) => (
          <Link
            href={`/chi-tiet/the-loai/${category?.slug}`}
            key={index}
            className="px-4 py-2 text-base border border-gray-200 transition-all hover:border-[#13c2c2] hover:text-[#13c2c2] rounded-xl"
          >
            {category?.name}
          </Link>
        ))}
      </div>
    </Marquee>
  );
};

export default CaterogiesAnimate;
