"use client";

import { formatDate } from "@/lib/utils";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import SkeletonSearchComicPreview from "../../skeleton/SkeletonSearchComicPreview";
import EmptyData from "../../common/EmptyData";
import { setShowModalSearch } from "@/store/slices/systemSlice";
import { SearchOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const SearchPreview = ({
  keyword,
  setKeyword,
}: {
  keyword: string;
  setKeyword: (value: string) => void;
}) => {
  const { items, loading, totalItems } = useSelector(
    (state: RootState) => state.comic.searchComicPreview
  );
  const dispatch: AppDispatch = useDispatch();

  if (keyword.trim() === "") return null;

  if (loading) {
    return <SkeletonSearchComicPreview />;
  }

  if (items?.length === 0 && !loading) {
    return (
      <EmptyData description="Oops! Không có truyện nào hợp ý bạn, chắc chúng đang ở thế giới khác!" />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 mt-4">
        <SearchOutlined />
        <Typography.Text>
          Tìm thấy {totalItems} kết quả cho từ khóa{" "}
          <span className="font-semibold">&quot;{keyword}&quot;</span>
        </Typography.Text>
      </div>
      <ul className="flex flex-col gap-4 overflow-y-auto max-h-96 pr-2">
        {items?.slice(0, 10)?.map((item: any, index: number) => (
          <li key={index} onClick={() => dispatch(setShowModalSearch(false))}>
            <Link
              onClick={() => setKeyword("")}
              href={`/thong-tin-truyen/${item?.slug}`}
              key={index}
              className="flex gap-2 group rounded-lg hover:bg-slate-100 hover:text-slate-700 p-2 border border-gray-100 transition-all"
            >
              <figure className="w-24 h-32 rounded-md overflow-hidden shadow-sm">
                <img
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "/error-img.png";
                  }}
                  className="w-full h-full object-cover"
                  src={`${process.env.NEXT_PUBLIC_OTRUYEN_URL_IMAGE}/${item?.thumb_url}`}
                  alt={item?.name}
                />
              </figure>
              <div className="flex flex-col flex-1 gap-1">
                <span>{item?.name ?? "Không xác định"}</span>
                <span className="text-xs">
                  {item?.chaptersLatest?.[0]?.chapter_name
                    ? `Chương mới nhất ${item?.chaptersLatest?.[0]?.chapter_name}`
                    : "Truyện đang lỗi"}
                </span>
                <span className="text-slate-500 text-xs">
                  Cập nhật {formatDate(item?.updatedAt ?? "lỗi")}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPreview;
