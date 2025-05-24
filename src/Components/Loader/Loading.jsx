import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <HashLoader className="#0067FF" />
    </div>
  );
};

export default Loading;
