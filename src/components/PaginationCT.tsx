"use client";

import type { PaginationCT } from "@/lib/types";
import { isPositiveInteger } from "@/lib/utils";
import { Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const PaginationCT = ({
  total,
  pageSize,
  currentPage,
  titleSearch,
}: PaginationCT) => {
  currentPage = isPositiveInteger(currentPage.toString()) ? currentPage : 1;

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChangePage = (page: number) => {
    const params = new URLSearchParams();
    params.set(titleSearch ? titleSearch : "page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <Pagination
      style={{ marginTop: "32px" }}
      onChange={(page) => handleChangePage(page)}
      align="center"
      current={Number(currentPage)}
      showSizeChanger={false}
      total={total}
      pageSize={pageSize}
    />
  );
};

export default PaginationCT;
