type HomeGreetingProps = {
  teamName: string;
  userName: string;
};

export default function HomeGreeting({ teamName, userName }: HomeGreetingProps) {
  return (
    <div className="mt-12">
      <p className="ml-1.75 text-[13px] leading-5 font-bold text-[#8892A6]">
        안녕하세요, {userName}님!
      </p>
      <h1 className="mt-2 ml-1.25 text-[26px] leading-6 font-bold text-[#172033]">
        {teamName}
      </h1>
    </div>
  );
}
