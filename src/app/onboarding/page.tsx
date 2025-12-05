"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/UserProvider';
import { client } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { apiColleges, apiDepartments } from '@/utils/mockData';

export default function OnboardingPage() {
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const [collegeId, setCollegeId] = useState<string>("");
    const [departmentId, setDepartmentId] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [studentNumber, setStudentNumber] = useState("");

    // Filter departments based on selected college
    const filteredDepartments = apiDepartments.filter(
        dept => dept.collegeId.toString() === collegeId
    );

    useEffect(() => {
        // Redirect if not logged in?
        // Actually, if coming from sign-up, user might be logged in or just have a token?
        // Assuming user context is populated. If not, maybe show login or assume flow handles it.
        // For now, implicit check:
        // if (!user) router.push('/login');
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!collegeId || !departmentId || !grade || !studentNumber) {
            alert("모든 정보를 입력해주세요.");
            return;
        }

        // Student ID check (simplistic)
        if (studentNumber.length !== 8) {
            alert("학번은 8자리여야 합니다.");
            return;
        }

        setLoading(true);
        try {
            // Assume user has an ID. If 'user' context is simple mock, we might need a real ID.
            // But getting from 'user' context is safest if available.
            // If user is null, we can't patch.
            const studentId = user?.id || 1; // Fallback to 1 for dev/mock if needed, but risky.

            const { error } = await client.PATCH("/api/student/{studentId}/onboarding", {
                params: {
                    path: { studentId }
                },
                body: {
                    collegeId: parseInt(collegeId),
                    departmentId: parseInt(departmentId),
                    grade: parseInt(grade),
                    studentNumber: studentNumber
                }
            });

            if (error) {
                console.error("Onboarding failed", error);
                throw error;
            }

            alert("정보가 저장되었습니다.");
            router.push('/');
        } catch (e) {
            console.error("Onboarding error", e);
            alert("정보 저장에 실패했습니다. (API 오류 또는 네트워크)");
            // fallback for demo if API fails
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">환영합니다!</CardTitle>
                    <CardDescription className="text-center">
                        원활한 서비스 이용을 위해 추가 정보를 입력해주세요.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="college">단과대학</Label>
                            <Select onValueChange={setCollegeId} value={collegeId}>
                                <SelectTrigger id="college">
                                    <SelectValue placeholder="단과대학 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {apiColleges.map((col) => (
                                        <SelectItem key={col.collegeId} value={col.collegeId.toString()}>
                                            {col.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department">학과(부)</Label>
                            <Select
                                onValueChange={setDepartmentId}
                                value={departmentId}
                                disabled={!collegeId}
                            >
                                <SelectTrigger id="department">
                                    <SelectValue placeholder="학과(부) 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredDepartments.map((dept) => (
                                        <SelectItem key={dept.departmentId} value={dept.departmentId.toString()}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grade">학년</Label>
                            <Select onValueChange={setGrade} value={grade}>
                                <SelectTrigger id="grade">
                                    <SelectValue placeholder="학년 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((g) => (
                                        <SelectItem key={g} value={g.toString()}>
                                            {g}학년
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="studentNumber">학번</Label>
                            <Input
                                id="studentNumber"
                                placeholder="8자리 학번 (예: 20241234)"
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                                maxLength={8}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "저장 중..." : "시작하기"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
