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
import { client } from "@/lib/api";
import { components } from "@/types/api";

const Signup = () => {
    const [step, setStep] = useState<'signup' | 'email' | 'verify'>('signup');
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [studentId, setStudentId] = useState<number | null>(null);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await client.POST("/api/student/sign-up", {
                body: {
                    nickname: formData.id,
                    password: formData.password,
                    studentName: formData.name,
                }
            }) as {
                data?: components["schemas"]["BaseResponseStudentSignUpResponseDTO"],
                error?: { message?: string }
            };

            if (error) {
                setError(error.message || '회원가입에 실패했습니다.');
                return;
            }

            if (data?.result?.id) {
                setStudentId(data.result.id);
                setStep('email');
            }
        } catch (err) {
            setError('서버 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId) return;
        setError('');
        setLoading(true);

        try {
            const { error } = await client.POST("/api/student/{studentId}/email/send-verification", {
                params: { path: { studentId } },
                body: { soongsilEmail: email + '@soongsil.ac.kr' }
            }) as {
                error?: { message?: string }
            };

            if (error) {
                setError(error.message || '인증 메일 발송에 실패했습니다.');
                return;
            }

            setStep('verify');
        } catch (err) {
            setError('서버 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId) return;
        setError('');
        setLoading(true);

        try {
            const { error } = await client.POST("/api/student/{studentId}/email/verify", {
                params: { path: { studentId } },
                body: { code: verificationCode }
            }) as {
                error?: { message?: string }
            };

            if (error) {
                setError(error.message || '인증에 실패했습니다.');
                return;
            }

            alert('회원가입 및 인증이 완료되었습니다.');
            router.push('/login');
        } catch (err) {
            setError('서버 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-[80vh] py-10">
            <Card className="w-full max-w-[500px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        {step === 'signup' && '회원가입'}
                        {step === 'email' && '이메일 인증'}
                        {step === 'verify' && '인증 코드 입력'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 'signup' && '수강신청 시뮬레이션을 위한 계정을 생성하세요.'}
                        {step === 'email' && '숭실대학교 이메일로 인증을 진행합니다.'}
                        {step === 'verify' && '이메일로 전송된 인증 코드를 입력하세요.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-4">
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

                            {error && <div className="text-sm text-destructive">{error}</div>}

                            <Button type="submit" className="w-full mt-6" disabled={loading}>
                                {loading ? '처리중...' : '다음'}
                            </Button>
                        </form>
                    )}

                    {step === 'email' && (
                        <form onSubmit={handleSendVerification} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">숭실대학교 이메일</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example"
                                        required
                                    />
                                    <span className="text-sm">@soongsil.ac.kr</span>
                                </div>
                            </div>

                            {error && <div className="text-sm text-destructive">{error}</div>}

                            <Button type="submit" className="w-full mt-6" disabled={loading}>
                                {loading ? '전송중...' : '인증 메일 발송'}
                            </Button>
                        </form>
                    )}

                    {step === 'verify' && (
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">인증 코드</Label>
                                <Input
                                    id="code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="인증 코드 입력"
                                    required
                                />
                            </div>

                            {error && <div className="text-sm text-destructive">{error}</div>}

                            <Button type="submit" className="w-full mt-6" disabled={loading}>
                                {loading ? '확인중...' : '인증 완료'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="justify-center">
                    {step === 'signup' && (
                        <div className="text-sm text-muted-foreground">
                            이미 계정이 있으신가요? <Link href="/login" className="text-primary font-bold hover:underline">로그인</Link>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
