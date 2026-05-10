type NoticeBannerProps = {
  kind: "success" | "error";
  message: string;
};

export function NoticeBanner({ kind, message }: NoticeBannerProps) {
  const styles =
    kind === "success"
      ? "border-[#cfdccd] bg-[#eef5ec] text-[#27432e]"
      : "border-[#e6c6c6] bg-[#fbefef] text-[#7a2f2f]";

  return (
    <div
      className={`rounded-[24px] border px-5 py-4 text-sm leading-7 shadow-[0_12px_30px_rgba(34,28,20,0.04)] ${styles}`}
    >
      {message}
    </div>
  );
}
