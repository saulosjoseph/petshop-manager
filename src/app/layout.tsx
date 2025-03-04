import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'Petshop Manager',
  description: 'Sistema de gerenciamento de petshop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}