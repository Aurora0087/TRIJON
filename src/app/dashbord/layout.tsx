import AdminWrapper from "@/components/AdminWrapper";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminWrapper>
            {children}
        </AdminWrapper>
    );
}