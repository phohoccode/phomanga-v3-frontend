"use client";

import EmptyData from "@/components/common/EmptyData";
import SkeletonSearchHistory from "@/components/skeleton/SkeletonSearchHistory";
import {
  deleteSearchHistory,
  getSearchHistory,
} from "@/store/asyncThunk/userAsyncThunk";
import { setShowModalSearch } from "@/store/slices/systemSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClockCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Divider, message, Tooltip, Typography } from "antd";
import PaginationCT from "@/components/PaginationCT";
import useGetQuery from "@/hooks/useGetQuery";

const SearchHistory = ({ keyword }: { keyword: string }) => {
  const dispatch: AppDispatch = useDispatch();
  const { items, total, loading } = useSelector(
    (state: RootState) => state.user.searchHistory
  );
  const { data: session } = useSession();
  const [loadingId, setLoadingId] = useState("");
  const page = useGetQuery("search-history-page", "1", "number");
  const limit = 10;

  useEffect(() => {
    if (session?.user?.id && items?.length === 0) {
      getAllSearchHistory();
    }
  }, [session, page]);

  const getAllSearchHistory = async () => {
    await dispatch(
      getSearchHistory({
        userId: session?.user?.id as string,
        limit: "10",
        page: page as string,
      })
    );
  };

  const handleDeleteSearchHistory = async (searchId: string) => {
    if (session?.user?.id) {
      setLoadingId(searchId);
      const response: any = await dispatch(
        deleteSearchHistory({
          userId: session?.user?.id as string,
          searchId,
        })
      );
      setLoadingId("");

      const { status, message: messageRes } = response.payload;

      if (status === "success") {
        getAllSearchHistory();
        message.success(messageRes || "Xoá lịch sử thành công!");
      } else {
        message.error(messageRes || "Xoá lịch sử thất bại!");
      }
    }
  };

  if (keyword?.trim() !== "") return null;

  if (items?.length === 0 && !loading) {
    return (
      <EmptyData description="Không có gì để xem lại… Chắc bạn vừa dọn dẹp ký ức? 🧹" />
    );
  }

  return (
    <div className="flex flex-col">
      <Divider orientation="left">
        <Typography.Text type="secondary">Lịch sử tìm kiếm</Typography.Text>
      </Divider>

      {loading ? (
        <SkeletonSearchHistory />
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {items?.map((item: any, index: number) => (
              <li
                key={index}
                className="flex justify-between gap-2 items-center"
              >
                <Link
                  onClick={() => dispatch(setShowModalSearch(false))}
                  href={`/tim-kiem?keyword=${item?.keyword}&page=1`}
                  className="text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-700 p-2 flex-1 max-w-[88%] lg:max-w-[95%] flex items-center gap-2 transition-all"
                >
                  <ClockCircleOutlined />
                  <span className="w-full truncate">{item?.keyword}</span>
                </Link>
                <Tooltip title="Xoá lịch sử" style={{ width: "10%" }}>
                  <Button
                    loading={loadingId === item?.id}
                    onClick={() => handleDeleteSearchHistory(item?.id)}
                    size="small"
                    icon={<CloseOutlined />}
                    variant="text"
                    color="default"
                  />
                </Tooltip>
              </li>
            ))}
          </ul>

          {total > limit && (
            <PaginationCT
              total={total}
              pageSize={limit}
              titleSearch="search-history-page"
              currentPage={page as string}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchHistory;
