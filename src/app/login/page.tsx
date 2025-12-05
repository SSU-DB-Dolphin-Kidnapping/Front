"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { client } from "@/lib/api";
import { components } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useUser } from '@/components/UserProvider';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Login
            const { data: loginData, error: loginError } = await client.POST("/api/student/login", {
                body: {
                    nickname: id,
                    password: password
                }
            }) as {
                data?: components["schemas"]["BaseResponseStudentLoginResponseDTO"],
                error?: { message?: string }
            };

            if (loginError || !loginData?.result?.id) {
                setError(loginError?.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
                setLoading(false);
                return;
            }

            const studentId = loginData.result.id;

            // 2. Get Student Info
            const { data: infoData, error: infoError } = await client.GET("/api/student/{studentId}", {
                params: {
                    path: { studentId }
                }
            }) as {
                data?: components["schemas"]["BaseResponseStudentInfoResponseDTO"],
                error?: { message?: string }
            };

            if (infoError || !infoData?.result) {
                setError(infoError?.message || '학생 정보를 불러오는데 실패했습니다.');
                setLoading(false);
                return;
            }

            const studentInfo = infoData.result;

            // 3. Update User Context
            login({
                id: studentInfo.id,
                studentId: studentInfo.studentNumber || '',
                departmentId: String(studentInfo.departmentId || ''),
                nickname: studentInfo.nickname || '',
                password: '', // Password is not returned
                name: studentInfo.studentName || '',
                avgLatency: studentInfo.avgReactionTime || 0,
            });

            // 4. Redirect based on onboarding status
            if (!studentInfo.studentNumber) {
                router.push('/onboarding');
            } else {
                router.push('/');
            }

        } catch (err) {
            console.error(err);
            setError('서버 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-[400px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">로그인</CardTitle>
                    <CardDescription className="text-center">
                        수강신청 시뮬레이션에 오신 것을 환영합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">아이디</Label>
                            <Input
                                id="id"
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                disabled={loading}
                            />
                        </div>
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <div className="text-sm text-muted-foreground">
                        계정이 없으신가요? <Link href="/signup" className="text-primary font-bold hover:underline">회원가입</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
