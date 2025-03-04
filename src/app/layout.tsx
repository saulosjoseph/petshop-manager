import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'Petshop Manager',
  description: 'Sistema de gerenciamento de petshop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-100 relative">
        {/* Fundo decorativo */}
        <div className="absolute inset-0 bg-pet-pattern bg-cover bg-center opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <Header />
          <main className="container mx-auto p-4 bg-white shadow-lg rounded-lg mt-4 ">{children}</main>
        </div>
      </body>
    </html>
  );
}