"use client";

import { useState, useEffect } from 'react';
import { mockTestSummaries, mockTestDetail, TestSummary, TestDetail } from '@/utils/mockData';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { client } from '@/lib/api';

const SimulationResult = () => {
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
    const [summaries, setSummaries] = useState<TestSummary[]>([]);
    const [detail, setDetail] = useState<TestDetail | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch list on mount
    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            try {
                const { data, error } = await client.GET("/api/test/results");
                if (data?.result && data.result.length > 0) {
                    // Map API-specific DTO to our interface if needed, or use directly if they match
                    // Using 'any' cast here as a quick bridge if types aren't perfectly aligned, 
                    // but they should be close.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setSummaries(data.result as any[]);
                } else {
                    console.log("Using mock summary data", error);
                    setSummaries(mockTestSummaries);
                }
            } catch (e) {
                console.error("Failed to fetch list", e);
                setSummaries(mockTestSummaries);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, []);

    // Fetch detail when testId changes
    useEffect(() => {
        if (!selectedTestId) return;

        const fetchDetail = async () => {
            setLoading(true);
            try {
                const { data, error } = await client.GET("/api/test/results/{testId}", {
                    params: { path: { testId: selectedTestId } }
                });

                if (data?.result) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setDetail(data.result as any);
                } else {
                    console.log("Using mock detail data", error);
                    // For mock purpose, we just return the single mock detail we have, regardless of ID
                    setDetail({ ...mockTestDetail, testId: selectedTestId });
                }
            } catch (e) {
                console.error("Failed to fetch detail", e);
                setDetail({ ...mockTestDetail, testId: selectedTestId });
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [selectedTestId]);

    const handleSelectTest = (testId: number) => {
        setSelectedTestId(testId);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setSelectedTestId(null);
        setViewMode('list');
        setDetail(null);
    };

    if (loading && !summaries.length && !detail) {
        return <div className="container py-10 text-center">Loading...</div>;
    }

    // --- Detail View ---
    if (viewMode === 'detail' && detail) {
        return (
            <div className="container py-10 animate-fade-in">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={handleBackToList}>
                    &larr; 목록으로 돌아가기
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">시뮬레이션 상세 결과</h1>
                    <p className="text-muted-foreground">
                        {new Date(detail.testDate).toLocaleString()} - {detail.bucketName} ({detail.studentName})
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground text-sm">성공률</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-green-600">
                                {detail.totalCourses > 0 ? Math.round((detail.successCount / detail.totalCourses) * 100) : 0}%
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {detail.successCount} 성공 / {detail.failCount} 실패
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground text-sm">신청 학점</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-primary">
                                {detail.earnedCredit} / {detail.plannedCredit}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                획득 / 계획
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px] text-center">우선순위</TableHead>
                                <TableHead className="text-center">상태</TableHead>
                                <TableHead>과목명</TableHead>
                                <TableHead>교수</TableHead>
                                <TableHead>학점</TableHead>
                                <TableHead>결과 메시지</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detail.courses.map((course, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="text-center font-medium">{course.priority}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`text-xl ${course.isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                                            {course.isSuccess ? '✓' : '✕'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        {course.courseName}
                                        <span className="text-xs text-muted-foreground ml-2">({course.className})</span>
                                    </TableCell>
                                    <TableCell>{course.professorName}</TableCell>
                                    <TableCell>{course.credit}</TableCell>
                                    <TableCell>
                                        {course.isSuccess ? (
                                            <Badge className="bg-green-600 hover:bg-green-700">신청 성공</Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                {course.failedReason || "신청 실패"}
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    // --- List View ---
    return (
        <div className="container py-10 animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">시뮬레이션 결과 목록</h1>
                    <p className="text-muted-foreground">과거 수강신청 시뮬레이션 기록입니다.</p>
                </div>
                <Link href="/cart">
                    <Button>새 시뮬레이션 준비 (장바구니)</Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">#</TableHead>
                            <TableHead>실행 일시</TableHead>
                            <TableHead className="text-center">신청 결과</TableHead>
                            <TableHead className="text-center">총 과목</TableHead>
                            <TableHead className="text-center"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {summaries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    기록된 시뮬레이션 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            summaries.map((summary) => (
                                <TableRow
                                    key={summary.testId}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleSelectTest(summary.testId)}
                                >
                                    <TableCell className="text-center font-medium">{summary.testId}</TableCell>
                                    <TableCell>{new Date(summary.testDate).toLocaleString()}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={summary.failCount === 0 ? "default" : "secondary"}>
                                            {summary.successCount} 성공 / {summary.failCount} 실패
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{summary.totalCourses}</TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="sm">상세보기 &rarr;</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SimulationResult;
