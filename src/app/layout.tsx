import { PermissionProvider } from "@/contexts/PermissionContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <PermissionProvider>
                    {children}
                </PermissionProvider>
            </body>
        </html>
    );
}
