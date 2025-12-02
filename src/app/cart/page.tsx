"use client";

import { useState } from 'react';
import { mockCartItems, getSubjectDetails } from '@/utils/mockData';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const Cart = () => {
    // Enrich cart items with subject details
    const initialItems = mockCartItems.map(item => ({
        ...item,
        subject: getSubjectDetails(item.subjectId),
        substitute: item.substituteSubjectId ? getSubjectDetails(item.substituteSubjectId) : null
    })).sort((a, b) => a.priority - b.priority);

    const [items, setItems] = useState(initialItems);

    const handleRemove = (itemId: string) => {
        setItems(items.filter(item => item.itemId !== itemId));
    };

    const handlePriorityChange = (itemId: string, direction: 'up' | 'down') => {
        const index = items.findIndex(i => i.itemId === itemId);
        if (index < 0) return;

        const newItems = [...items];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
            // Update priority numbers
            newItems[index].priority = index + 1;
            newItems[index - 1].priority = index;
        } else if (direction === 'down' && index < items.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
            // Update priority numbers
            newItems[index].priority = index + 1;
            newItems[index + 1].priority = index + 2;
        }
        setItems(newItems);
    };

    return (
        <div className="container py-10 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">장바구니</h1>
                    <p className="text-muted-foreground">수강신청 우선순위를 관리하세요.</p>
                </div>
                {items.length > 0 && (
                    <Button>
                        우선순위 저장
                    </Button>
                )}
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-center">우선순위</TableHead>
                            <TableHead>이수구분</TableHead>
                            <TableHead>과목명</TableHead>
                            <TableHead>교수</TableHead>
                            <TableHead>시간/장소</TableHead>
                            <TableHead>대체과목</TableHead>
                            <TableHead className="w-[100px] text-center">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={item.itemId}>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handlePriorityChange(item.itemId, 'up')}
                                            disabled={index === 0}
                                        >
                                            ▲
                                        </Button>
                                        <span className="font-bold w-5">{index + 1}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handlePriorityChange(item.itemId, 'down')}
                                            disabled={index === items.length - 1}
                                        >
                                            ▼
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.subject?.isMajor ? "default" : "secondary"}>
                                        {item.subject?.isMajor ? "전공" : "교양"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{item.subject?.name}</TableCell>
                                <TableCell>{item.subject?.professorName}</TableCell>
                                <TableCell>{item.subject?.day} {item.subject?.startTime}</TableCell>
                                <TableCell>
                                    {item.substitute ? (
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                            ↳ {item.substitute.name}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant="destructive" size="sm" onClick={() => handleRemove(item.itemId)}>
                                        삭제
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center">
                                    <p className="mb-4 text-muted-foreground">장바구니가 비어있습니다.</p>
                                    <Link href="/subjects">
                                        <Button>과목 둘러보기</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Cart;
