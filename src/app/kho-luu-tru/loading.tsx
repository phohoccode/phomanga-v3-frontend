import Layout from "@/components/layout/Layout";
import SkeletonComicList from "@/components/skeleton/SkeletonComicList";
// import { Breadcrumb, Divider } from "antd";
import Breadcrumb from "antd/es/breadcrumb";
import "antd/es/breadcrumb/style";

import Divider from "antd/es/divider";
import "antd/es/divider/style";


const Loading = () => {
  const items = [{ title: "Trang chủ" }, { title: "Kho lưu trữ" }];

  return (
    <Layout>
      <Breadcrumb items={items} />
      <Divider orientation="center">Kho lưu trữ</Divider>
      <SkeletonComicList quantity={24} />
    </Layout>
  );
};

export default Loading;
