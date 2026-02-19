import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
    title: 'Nexus Gaming Platform',
    description: 'Discover, download, and play incredible games. Connect with players worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body>
                <AuthProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1c1c28',
                                color: '#f0f0f5',
                                border: '1px solid #2a2a3a',
                                borderRadius: '12px',
                                fontSize: '14px',
                            },
                        }}
                    />
                    <div className="flex min-h-screen flex-col">
                        <Navbar />
                        <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 overflow-y-auto p-5 md:p-6">
                                {children}
                            </main>
                        </div>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
