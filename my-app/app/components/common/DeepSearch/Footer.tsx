import PerfectButton from "./perfect";
import BackButton from "./back";
import SkipButton from "./skip";

export default function Footer() {
  return (
    <footer>
      <div
        className="px-[20px] flex items-center justify-between bg-white py-[20px] px-[47px]"
        style={{
          borderTop: "1px solid #D1D5DB", // Neutral/grey 300 = #D1D5DB
        }}
      >
        {/* Left side - Back button */}
        <BackButton label="Back" />

        {/* Right side buttons container */}
        <div className="flex flex-row gap-[30px]">
          {/* Skip text button with space to the right */}
          <SkipButton />
          {/* Right side perfect button component */}
          <PerfectButton />
        </div>
      </div>
    </footer>
  );
}
