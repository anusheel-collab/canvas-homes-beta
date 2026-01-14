import PerfectButton from "./perfect";
import BackButton from "./back";
import SkipButton from "./skip";

interface FooterProps {
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  showBack?: boolean;
  isNextDisabled?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function Footer({
  onBack,
  onNext,
  onSkip,
  showBack = true,
  isNextDisabled = false,
  currentStep = 0,
  totalSteps = 1,
}: FooterProps) {
  // Determine if we should show the Skip button
  const showSkipButton = currentStep < totalSteps - 1;

  // Determine the Perfect button label
  const perfectButtonLabel =
    currentStep === totalSteps - 1 ? "Show Result" : "Yes. It is perfect";

  return (
    <footer>
      <div
        className="flex items-center justify-between bg-white py-[20px] px-[47px]"
        style={{
          borderTop: "1px solid #D1D5DB",
        }}
      >
        {/* Left side - Back button */}
        {showBack && currentStep > 0 ? (
          <BackButton label="Back" onClick={onBack} />
        ) : (
          <div /> // Empty div to maintain flex spacing
        )}

        {/* Right side buttons container */}
        <div className="flex flex-row gap-[30px]">
          {/* Skip button (only show if not on last step) */}
          {showSkipButton && <SkipButton onClick={onSkip || onNext} />}

          {/* Perfect button */}
          <PerfectButton
            onClick={onNext}
            disabled={isNextDisabled}
            label={perfectButtonLabel}
          />
        </div>
      </div>
    </footer>
  );
}
