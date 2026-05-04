export default function Loading() {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="h-1 w-48 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-primary-black" />
      </div>
    </div>
  );
}
