"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useUser } from '@/components/UserProvider';
import { cn } from "@/lib/utils";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useUser();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="border-b bg-background h-16 flex items-center px-4 sticky top-0 z-50">
            <div className="flex items-center gap-2 font-bold text-lg">
                <span>SSU 수강신청 시뮬레이션</span>
            </div>
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                {[
                    { href: "/", label: "홈" },
                    { href: "/subjects", label: "과목 조회" },
                    { href: "/cart", label: "장바구니" },
                    { href: "/simulation", label: "시뮬레이션 결과" },
                    { href: "/latency", label: "반응속도 측정" },
                ].map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive(href) ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="ml-auto flex items-center space-x-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{user.name}</span>
                        <Button variant="outline" size="sm" onClick={logout}>
                            로그아웃
                        </Button>
                    </div>
                ) : (
                    <Button size="sm" onClick={() => router.push('/login')}>
                        로그인
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
