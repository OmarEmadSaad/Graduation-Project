import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <HashLoader className="text-blue-400" />
    </div>
  );
};

export default Loading;
