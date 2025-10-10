import { PostDetail } from "../types";
import PostPoll from "./PostPoll";
import tw from "@/share/utils/tw";

interface PollCardProps {
  items: PostDetail;
  className?: string;
}

function PollCard({ items, className }: PollCardProps) {
  const dummyItems = {
    postId: 1,
    polls: {
      options: [
        {
          index: 1,
          text: "옵션 1",
          voteCount: 10,
          isVoted: false,
        },
        {
          index: 2,
          text: "옵션 2",
          voteCount: 20,
          isVoted: false,
        },
        {
          index: 3,
          text: "옵션 3",
          voteCount: 30,
          isVoted: false,
        },
      ],
    },
  };

  return (
    <li className={tw("w-80 p-4 flex-shrink-0", className)}>
      <div className="flex flex-col px-2 mb-4">
        <div className="flex justify-between">
          <h3>타이틀</h3>
          <p>작성자</p>
        </div>
        <p>여러분이라면 어떻게 하실 건가요?</p>
      </div>

      <PostPoll
        items={
          dummyItems.polls?.options.map((item, i) => ({
            index: i + 1,
            text: item.text,
            voteCount: item.voteCount || 0,
            isVoted: item.isVoted || false,
          })) || []
        }
      />
    </li>
  );
}
export default PollCard;
