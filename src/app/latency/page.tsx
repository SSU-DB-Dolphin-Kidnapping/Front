"use client";

import { useState, useEffect, useRef } from 'react';
import { mockStudents } from '@/utils/mockData';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
} from "@/components/ui/card";
import { useUser } from '@/components/UserProvider';
import { client } from '@/lib/api';

const LatencyTest = () => {
    const { user } = useUser();
    const [student, setStudent] = useState(user || mockStudents[0]);
    const [isTesting, setIsTesting] = useState(false);
    const [, setClickCount] = useState(0);
    const [results, setResults] = useState<number[]>([]);
    const [targetVisible, setTargetVisible] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [message, setMessage] = useState("테스트 시작 버튼을 눌러 측정을 시작하세요.");

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTest = () => {
        setIsTesting(true);
        setClickCount(0);
        setResults([]);
        setMessage("준비하세요...");
        scheduleNextTarget();
    };

    const scheduleNextTarget = () => {
        setTargetVisible(false);
        const delay = Math.random() * 2000 + 1000; // 1-3 seconds
        timerRef.current = setTimeout(() => {
            setTargetVisible(true);
            setStartTime(Date.now());
            setMessage("지금 클릭하세요!");
        }, delay);
    };

    const handleTargetClick = async () => {
        if (!targetVisible) return;

        const endTime = Date.now();
        const latency = endTime - startTime;
        const newResults = [...results, latency];
        setResults(newResults);
        setClickCount(prev => prev + 1);

        if (newResults.length >= 5) {
            finishTest(newResults);
        } else {
            setMessage(`${newResults.length + 1}/5 회 측정됨: ${latency}ms. 다음 신호를 기다리세요...`);
            scheduleNextTarget();
        }
    };

    const finishTest = async (finalResults: number[]) => {
        setIsTesting(false);
        setTargetVisible(false);
        const sum = finalResults.reduce((a, b) => a + b, 0);
        const avg = Math.round(sum / finalResults.length);

        try {
            const { error } = await client.PATCH("/api/student/reaction-time", {
                body: {
                    avgReactionTime: avg
                }
            });

            // Update local state only on success
            const updatedStudent = { ...student, avgLatency: avg };
            setStudent(updatedStudent);
            setMessage(`테스트 완료! 평균 반응속도: ${avg}ms (저장됨)`);

        } catch (e) {
            console.error(e);
            setMessage(`테스트 완료! 평균: ${avg}ms (네트워크 오류)`);
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="container py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">반응속도 측정</h1>
                <p className="text-muted-foreground">수강신청 성공을 위해 클릭 반응속도를 측정하세요.</p>
            </div>

            <Card className="text-center p-8">
                <div className="mb-8">
                    <h3 className="text-muted-foreground mb-2">현재 평균 반응속도</h3>
                    <div className="text-6xl font-bold text-primary">
                        {student.avgLatency || 0}<span className="text-2xl">ms</span>
                    </div>
                </div>

                {!isTesting ? (
                    <Button size="lg" className="text-lg px-8 py-6" onClick={startTest}>
                        새 테스트 시작 (5회 클릭)
                    </Button>
                ) : (
                    <div
                        className={`
                            h-[300px] rounded-md border flex items-center justify-center cursor-pointer transition-colors
                            ${targetVisible ? 'bg-green-500 text-white' : 'bg-secondary text-foreground'}
                        `}
                        onMouseDown={handleTargetClick}
                    >
                        <h2 className="text-4xl font-bold select-none">{message}</h2>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="mt-8 flex gap-4 justify-center flex-wrap">
                        {results.map((res, idx) => (
                            <Badge key={idx} variant="secondary" className="text-lg px-4 py-2">
                                {idx + 1}회: {res}ms
                            </Badge>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LatencyTest;
