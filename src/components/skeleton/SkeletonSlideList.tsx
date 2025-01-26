"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/assets/styles/swiper.css";
import { EffectCoverflow } from "swiper/modules";
import { Skeleton } from "antd";

const SkeletonSlideList = ({ width }: { width: number }) => {
  return (
    <Swiper
      modules={[EffectCoverflow]}
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      initialSlide={width > 1024 ? 13 : 6}
      speed={600}
      preventClicks={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 0,
        stretch: 80,
        depth: 200,
        modifier: 1,
        slideShadows: false,
      }}
      className="mySwiper"
    >
      {[...Array(width > 1024 ? 24 : 13)].map((_, index) => (
        <SwiperSlide key={index}>
          <Skeleton.Node style={{ width: 280, height: 360 }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SkeletonSlideList;
