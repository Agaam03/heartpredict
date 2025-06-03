import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-8 z-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 z-50 ">
        {/* Company Logo and Tagline */}
        <div className="mb-8 md:mb-0">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            HEART PREDICT
          </h2>
          <p className="text-sm mb-2">We create possibilities</p>
          <p className="text-sm mb-2">for the connected world.</p>
          <p className="text-sm font-bold">Be Bold.</p>
          <p className="text-xs mt-8">
            © {new Date().getFullYear()} Data Scientist. All Rights Reserved.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="text-sm font-medium mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-sm hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm hover:text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/capabilities"
                className="text-sm hover:text-gray-300"
              >
                Capabilities
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-sm hover:text-gray-300">
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Visit and Contact Info */}
        <div>
          <h3 className="text-sm font-medium mb-4">Visit</h3>
          <p className="text-sm mb-1">East Java. Indonesia</p>
          <p className="text-sm mb-1">Universitas Muhammadiyah Lamongan</p>
          <p className="text-sm mb-6">M. Cita Prasetya Agam</p>

          <h3 className="text-sm font-medium mb-2">New Business</h3>
          <p className="text-sm mb-1">agam.prasetya03@gmail.com</p>
          <p className="text-sm">+62-8993787093</p>
        </div>

        {/* Follow and Legal */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-4">Follow</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.linkedin.com/in/agaam/"
                  className="text-sm hover:text-gray-300"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/agaam/"
                  className="text-sm hover:text-gray-300"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/agaam/"
                  className="text-sm hover:text-gray-300"
                >
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-gray-300">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-gray-300">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Next Section Indicator */}
        <div className="col-span-1 md:col-span-4 mt-4 md:mt-8 flex justify-end">
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-400">Created : Agaam</p>
            <div className="w-[82px] h-px bg-white mt-1"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
