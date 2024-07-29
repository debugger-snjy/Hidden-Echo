import Navbar from "@/components/Navbar";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />

            <div className="min-h-[83vh]">{children}</div>

            <footer className="text-center text-lg p-3 md:p-6 bg-gray-900 text-white">
                © 2024 Hidden Echo | All rights reserved.
            </footer>

        </>
    );
}
