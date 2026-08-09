import { Menu, Moon, Search, X } from "lucide-react";
import { useState } from "react";

const Navbar = ({
  onHome,
  onResearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHome = () => {
    setMobileMenuOpen(false);
    onHome?.();
  };

  const handleResearch = () => {
    setMobileMenuOpen(false);
    onResearch?.();
  };

  return (
    <header className="relative z-50 border-b border-[#e5ddd7] bg-[#f8f5f1]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">

        {/* Logo */}
        <button
          type="button"
          onClick={handleHome}
          className="font-editorial text-2xl font-medium tracking-tight text-[#1a1a1a] sm:text-3xl"
        >
          DineScout
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 lg:flex">
          <button
            type="button"
            onClick={handleResearch}
            className="text-sm font-medium tracking-wide text-[#766b65] transition-colors hover:text-[#a64d32]"
          >
            Research
          </button>

          <button
            type="button"
            className="text-sm font-medium tracking-wide text-[#766b65] transition-colors hover:text-[#a64d32]"
          >
            History
          </button>

          <button
            type="button"
            className="text-sm font-medium tracking-wide text-[#766b65] transition-colors hover:text-[#a64d32]"
          >
            About
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1a1a1a] transition-colors hover:bg-[#ede6df] hover:text-[#a64d32]"
          >
            <Search size={18} strokeWidth={1.6} />
          </button>

          <button
            type="button"
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1a1a1a] transition-colors hover:bg-[#ede6df] hover:text-[#a64d32]"
          >
            <Moon size={18} strokeWidth={1.6} />
          </button>
        </div>

        {/* Mobile Menu */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center text-[#1a1a1a] lg:hidden"
        >
          {mobileMenuOpen ? (
            <X size={23} strokeWidth={1.5} />
          ) : (
            <Menu size={23} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e5ddd7] bg-[#f8f5f1] lg:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-5 py-5 sm:px-8">

            <button
              type="button"
              onClick={handleHome}
              className="border-b border-[#e5ddd7] py-4 text-left text-sm font-medium tracking-wide text-[#1a1a1a]"
            >
              Home
            </button>

            <button
              type="button"
              onClick={handleResearch}
              className="border-b border-[#e5ddd7] py-4 text-left text-sm font-medium tracking-wide text-[#1a1a1a]"
            >
              Research
            </button>

            <button
              type="button"
              className="border-b border-[#e5ddd7] py-4 text-left text-sm font-medium tracking-wide text-[#1a1a1a]"
            >
              History
            </button>

            <button
              type="button"
              className="py-4 text-left text-sm font-medium tracking-wide text-[#1a1a1a]"
            >
              About
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;