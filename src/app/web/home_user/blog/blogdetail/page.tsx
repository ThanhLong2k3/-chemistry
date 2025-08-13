"use client";

import { useSearchParams } from "next/navigation";
import BlogDetailPageClient from "@/modules/systems/manage-web/components/blog/blogDetail";

export default function BlogDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <div>Không tìm thấy ID blog</div>;
  }

  return <BlogDetailPageClient id={id} />;
}
