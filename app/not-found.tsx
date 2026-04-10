import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex w-full h-full items-center justify-center flex-col gap-4">
      <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
      <Link href="/" className="text-primary-01 hover:text-primary-02">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
