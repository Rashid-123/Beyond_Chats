import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Beyond_Chats',
  description: 'Beyond Chats',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body >
          <Navbar />
          <div className='pt-15'>   <main>{children}</main></div>
       
        </body>
      </html>
    </ClerkProvider>
  );
}