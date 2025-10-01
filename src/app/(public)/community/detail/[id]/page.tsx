// 빈 nesting 한 단계가 더 생기는 것이 별로인 것 같기도 한데 유저에게 제공되는 주소로는 조금 더 명확한 것 같기도 함.

import { getPost } from "@/domains/community/api/getPost";
import { postDetailSchema } from "@/domains/community/schemas/posts";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  const parsedPost = postDetailSchema.safeParse(post);

  console.log(parsedPost);

  return (
    <div className="w-[80%] flex flex-col items-center min-h-[calc(100vh-140px)] pt-15">
      <header className="w-full flex">
        <div className="flex items-center gap-2">
          <div className="rounded-full w-10 h-10 bg-gray-300" />
          <div>
            <h3 className="text-sm">
              {parsedPost?.data?.author && parsedPost.data.author}
            </h3>
          </div>
        </div>
      </header>

      {parsedPost?.data?.title && parsedPost.data.title}
      <br />
      {parsedPost?.data?.content && parsedPost.data.content}
      <br />
      {parsedPost?.data?.author && parsedPost.data.author}
      <br />
      {parsedPost?.data?.category && parsedPost.data.category}
      <br />
      {parsedPost?.data?.likeCount && parsedPost.data.likeCount}
      <br />
      {parsedPost?.data?.liked && parsedPost.data.liked}
      <br />
      {parsedPost?.data?.createdDate && parsedPost.data.createdDate}
      <br />
      {parsedPost?.data?.polls.options.map((option) => option.text)}
      <br />
    </div>
  );
}
export default Page;
