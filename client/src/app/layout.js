import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Auth App',
  description: 'Authentication with Clerk',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}