import ShopSideBar from "@/components/ShopSideBar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex bg-slate-200 min-h-svh w-full relative">
            <ShopSideBar/>
            {children}
        </div>
    );
}
