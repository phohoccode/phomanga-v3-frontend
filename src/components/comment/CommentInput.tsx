"use client";

import { socket } from "@/lib/socket";
import {
  createComment,
  getComments,
} from "@/store/asyncThunk/commentAsyncThunk";
import { AppDispatch, RootState } from "@/store/store";
import { Button, Input, message } from "antd";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { TextArea } = Input;

const CommentInput = () => {
  const [value, setValue] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const params = useParams();
  const { data: sesstion } = useSession();
  const [loading, setLoading] = useState(false);
  const { sort } = useSelector((state: RootState) => state.comment);

  const handleComment = async () => {
    if (!sesstion?.user) {
      message.info("Bạn cần đăng nhập để bình luận nhé!");
      return;
    }

    if (value.trim() === "") {
      message.info("Bạn muốn bình luận gì thì viết đi nào!");
      return;
    }

    setLoading(true);
    const response: any = await dispatch(
      createComment({
        userId: sesstion?.user?.id as string,
        content: value,
        comicSlug: params.slug as string,
      })
    );
    setLoading(false);

    if (response.payload?.status === "success") {
      message.success("Cảm ơn bạn đã bình luận!");
      setValue("");

      dispatch(
        getComments({
          comicSlug: params.slug as string,
          limit: 10,
          page: "1",
          sort: sort as "asc" | "desc",
        })
      );

      socket.emit("newComment", {
        slug: params?.slug,
      });
    }
  };

  return (
    <>
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Bạn đang suy nghĩ gì thế ..."
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
      <Button
        onClick={handleComment}
        loading={loading}
        color="cyan"
        variant="solid"
        style={{ display: "flex", margin: "12px 0 0 auto" }}
      >
        Bình luận
      </Button>
    </>
  );
};

export default CommentInput;
