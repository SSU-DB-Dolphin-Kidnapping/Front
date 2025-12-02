"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const Signup = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        studentId: '',
        major: ''
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        // TODO: Implement actual signup logic here
        console.log('Signup data:', formData);
        alert('회원가입이 완료되었습니다. (시뮬레이션)');
        router.push('/login');
    };

    return (
        <div className="container flex items-center justify-center min-h-[80vh] py-10">
            <Card className="w-full max-w-[500px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">회원가입</CardTitle>
                    <CardDescription className="text-center">
                        수강신청 시뮬레이션을 위한 계정을 생성하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">아이디</Label>
                            <Input
                                id="id"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="아이디"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="비밀번호"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="비밀번호 확인"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="이름"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="studentId">학번</Label>
                            <Input
                                id="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                placeholder="학번 (8자리)"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="major">학과</Label>
                            <Input
                                id="major"
                                value={formData.major}
                                onChange={handleChange}
                                placeholder="학과"
                                required
                            />
                        </div>

                        {error && <div className="text-sm text-destructive">{error}</div>}

                        <Button type="submit" className="w-full mt-6">
                            가입하기
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <div className="text-sm text-muted-foreground">
                        이미 계정이 있으신가요? <Link href="/login" className="text-primary font-bold hover:underline">로그인</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
