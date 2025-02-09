"use client";

import ComicList from "@/components/comic/ComicList";
import ComicTitle from "@/components/comic/ComicTitle";
import ButtonLink from "@/components/common/ButtonLink";
import CaterogiesAnimate from "@/components/CategoriesAnimate";
import Layout from "@/components/layout/Layout";
import SlideList from "@/components/comic/SlideList";
import {
  fetchCategorys,
  fetchCompletedComic,
  fetchNewComic,
  fetchPublishedComic,
  fetchUpComingComic,
} from "@/store/asyncThunk/comicAsyncThunk";
import { AppDispatch, RootState } from "@/store/store";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Divider, Row } from "antd";
import Rankings from "@/components/rankings/Rankings";

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const { items: newComic, loading: newComicLoading } = useSelector(
    (state: RootState) => state.comic.newComic
  );
  const { items: publishedComic, loading: publishedComicLoading } = useSelector(
    (state: RootState) => state.comic.publishedComic
  );
  const { items: upComingComic, loading: upComingComicLoading } = useSelector(
    (state: RootState) => state.comic.upComingComic
  );
  const { items: completedComic, loading: completedComicLoading } = useSelector(
    (state: RootState) => state.comic.completedComic
  );

  const sessions = [
    {
      id: 1,
      name: "Truyện mới",
      href: "/chi-tiet/danh-sach/moi-ra-mat",
      data: newComic,
      loading: newComicLoading,
    },
    {
      id: 2,
      name: "Truyện đang phát hành",
      href: "/chi-tiet/danh-sach/dang-phat-hanh",
      data: publishedComic,
      loading: publishedComicLoading,
    },
    {
      id: 3,
      name: "Truyện đã hoàn thành",
      href: "/chi-tiet/danh-sach/da-hoan-thanh",
      data: completedComic,
      loading: completedComicLoading,
    },
    {
      id: 4,
      name: "Truyện sắp ra mắt",
      href: "/chi-tiet/danh-sach/sap-ra-mat",
      data: upComingComic,
      loading: upComingComicLoading,
    },
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        dispatch(fetchNewComic()),
        dispatch(fetchPublishedComic()),
        dispatch(fetchUpComingComic()),
        dispatch(fetchCompletedComic()),
        dispatch(fetchCategorys()),
      ]);
    };

    fetchAllData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <SlideList />

        <CaterogiesAnimate />

        <Rankings />

        <div className="flex flex-col gap-6">
          {sessions.map((session) => (
            <div key={session.id} className="flex flex-col gap-6">
              <ComicTitle
                title={session.name}
                orientation="center"
                loading={session.loading}
              />
              <ComicList data={session.data} loading={session.loading} />
              <ButtonLink
                href={session.href}
                text="Xem thêm"
                showIcon={true}
                positionIcon="end"
                positionItem="end"
                icon={<ArrowRightOutlined />}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
