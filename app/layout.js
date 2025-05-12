import './globals.css';

export const metadata = {
  title: 'Liminality - An Interactive Website',
  description:
    'An interactive website which dives into liminality and liminal spaces, by Amey Vijeesh.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
