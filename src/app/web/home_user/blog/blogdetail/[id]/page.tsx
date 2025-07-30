import BlogDetail from "@/modules/systems/manage-web/components/blog/blogDetail/BlogDetail";
import { Home_Api } from "@/services/home.service";
import { IBlog_Get } from "@/types/blog";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const BlogDetailPage =()=>{
    const params = useParams();
    const id = params?.id;
    const [blogDetail, setBlogDetail] = useState<IBlog_Get>();

    useEffect( () => {
        document.title = "Chi tiết bài viết";
        if (id) {
            GetBlogDetailById(id as string);
        }
    }, [id]);

    const GetBlogDetailById = async (id: string) => {
        const blogDetailData: any = await Home_Api.getBlogById(id);
        setBlogDetail(blogDetailData.data.data);
        console.log(blogDetailData.data.data);
    }
    return(
        <BlogDetail blog={blogDetail} />
    );
}