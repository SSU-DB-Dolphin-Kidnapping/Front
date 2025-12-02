"use client";

import Link from 'next/link';
import { mockStudents, mockCartItems } from '@/utils/mockData';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useUser } from '@/components/UserProvider';

export default function Home() {
    const { user } = useUser();
    const student = user || mockStudents[0];
    const cartCount = mockCartItems.length;

    return (
        <div className="container py-10 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">환영합니다, {student.name}님</h1>
                <p className="text-xl text-muted-foreground">수강신청 시뮬레이션 시스템에 오신 것을 환영합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/latency" className="block">
                    <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="text-4xl mb-4">⚡</div>
                            <CardTitle>반응속도 측정</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary mb-2">
                                {student.avgLatency || 0}ms
                            </div>
                            <CardDescription>
                                클릭 반응속도를 측정하고 개선하세요.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/cart" className="block">
                    <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="text-4xl mb-4">🛒</div>
                            <CardTitle>장바구니</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-600 mb-2">
                                {cartCount} 개
                            </div>
                            <CardDescription>
                                관심 과목을 관리하고 우선순위를 설정하세요.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/simulation" className="block">
                    <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="text-4xl mb-4">📊</div>
                            <CardTitle>시뮬레이션 결과</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                준비됨
                            </div>
                            <CardDescription>
                                일일 수강신청 시뮬레이션 결과를 확인하세요.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="mt-16 text-center">
                <Link href="/subjects">
                    <Button size="lg" className="text-lg px-8 py-6">
                        과목 검색 시작하기
                    </Button>
                </Link>
            </div>
        </div>
    );
}
