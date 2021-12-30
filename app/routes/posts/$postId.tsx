import { useParams } from "remix";

const PostItem = () => {
  const { postId } = useParams();
  return <div>Post:{postId}</div>;
};

export default PostItem;
