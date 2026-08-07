type NotificationErrorStateProps = {
  message?: string;
};

export default function NotificationErrorState({
  message = "알림을 불러오지 못했습니다.",
}: NotificationErrorStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center pb-18">
      <p className="text-[15px] leading-6 font-bold text-[#111827]">
        {message}
      </p>
    </div>
  );
}
