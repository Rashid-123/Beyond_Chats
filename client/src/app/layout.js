
// 'use client'

// import { ClerkProvider } from '@clerk/nextjs';
// import Navbar from '@/components/Navbar';
// import './globals.css';
// import Footer from '@/components/Footer';
// import { usePathname } from 'next/navigation';

// // export const metadata = {
// //   title: 'Beyond_Chats',
// //   description: 'Beyond Chats',
// // };

// export default function RootLayout({ children }) {

//   const pathname = usePathname();
//   const isChatroute = pathname.includes('/chat');

//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body >
//           <Navbar />
//           <div className={isChatroute ? '' : 'pt-15'}>   <main>{children}</main></div>
//           {!isChatroute && <Footer />}
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }


'use client'

import { ClerkProvider, SignedIn } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import './globals.css';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react'; // Optional icon (you can use any)

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isChatRoute = pathname.includes('/chat');

  return (
    <ClerkProvider  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body>
          <Navbar />
          <div className={isChatRoute ? '' : 'pt-15'}>
            <main>{children}</main>
          </div>

          {/* ✅ Show Footer only when not on chat route */}
          {!isChatRoute && <Footer />}


          <SignedIn>
            {!isChatRoute && (
              <Link
                href="/chat"
                className="fixed bottom-6 right-6 group z-40"
              >
                <div className="relative flex items-center gap-3">
                  {/* Tooltip */}
                  <div className="absolute right-full mr-3 bg-3 text-1 text-sm font-medium px-4 py-2 rounded-lg shadow-lg border border-2 whitespace-nowrap pointer-events-none">
                    Start Chatting
                  </div>

                  {/* Button */}
                  <button className="bg-[#d6a676] hover:bg-button-hover text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 flex-shrink-0 cursor-pointer">
                    <MessageSquare className="w-6 h-6" />
                  </button>
                </div>
              </Link>
            )}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
