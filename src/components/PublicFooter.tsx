import Link from "next/link";
import { Leaf } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-sage-900 text-sage-300 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-sage-700 flex items-center justify-center">
                <Leaf className="text-sage-200" size={18} />
              </div>
              <span className="font-bold text-white text-lg">SupplyChain Shield</span>
            </div>
            <p className="text-sm leading-relaxed text-sage-400">
              Smart logistics for a greener India. Every matched trip cuts empty miles and protects our planet.
            </p>
          </div>

          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#sustainability" className="hover:text-white transition-colors duration-200">
                  Sustainability Impact
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors duration-200">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-sage-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-sage-500">
          <p>© 2026 SupplyChain Shield India. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Leaf size={14} className="text-sage-500" />
            Built for environmental sustainability
          </p>
        </div>
      </div>
    </footer>
  );
}
