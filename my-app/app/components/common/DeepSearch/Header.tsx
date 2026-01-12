import Image from "next/image";
import Link from "next/link";

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
        border-b
        bg-[#FAFAFA]
      "
    >
      {/* Left: Logo Button */}
      <Link href="/" aria-label="Go to home">
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={101}
          height={46}
          priority
          className="cursor-pointer"
        />
      </Link>

      {/* Right: Close Button */}
<button
  aria-label="Close"
//   onClick={() => console.log("Close clicked")}
  className="
    relative
    left-[-15px]
    top-[-2px]

    w-[93px]
    h-[37px]
    flex
    items-center
    justify-center

    rounded-md
    bg-white
    border
    border-gray-200

    shadow-[0_2px_4px_rgba(0,0,0,0.08)]
    transition-all
    duration-150
    ease-out

    hover:shadow-[0_4px_8px_rgba(0,0,0,0.12)]
    hover:-translate-y-[1px]

    active:translate-y-[1px]
    active:shadow-[0_1px_2px_rgba(0,0,0,0.12)]

    cursor-pointer
    select-none
  "
>
  <Image
    src="/close.svg"
    alt="Close"
    fill
    className="object-contain pointer-events-none"
  />
</button>


    </header>
  );
}
