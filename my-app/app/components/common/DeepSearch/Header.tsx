import Image from "next/image";
import Link from "next/link";
import CloseButton from "./close"; // Assuming close.tsx is in the same directory

export default function Header() {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        w-full
        h-16
        px-6
        flex
        items-center
        justify-between
        bg-[#FAFAFA]
        pt-[2px]  {/* Add 2px top padding */}
      "
    >
      {/* Left: Logo Button */}
      <Link href="/" aria-label="Go to home" className="relative left-[8px]">
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={101}
          height={46}
          priority
          className="cursor-pointer"
        />
      </Link>

      {/* Right: Close Button Component */}
      <div className="relative left-[-15px] top-[-2px]">
        <CloseButton />
      </div>
    </header>
  );
}
