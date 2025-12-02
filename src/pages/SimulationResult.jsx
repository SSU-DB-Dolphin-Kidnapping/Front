import React from 'react';
import { mockSimulationResults, mockCartItems, getSubjectDetails } from '../utils/mockData';
import { Link } from 'react-router-dom';
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

const SimulationResult = () => {
  // Combine results with item details
  const results = mockSimulationResults.map(res => {
    const item = mockCartItems.find(i => i.itemId === res.itemId);
    const subject = item ? getSubjectDetails(item.subjectId) : null;
    return { ...res, subject, item };
  });

  const successCount = results.filter(r => r.success).length;
  const totalCredits = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + (r.subject ? r.subject.credits : 0), 0);

  return (
    <div className="container py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">시뮬레이션 결과</h1>
        <p className="text-muted-foreground">최근 수강신청 시뮬레이션 결과입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">성공률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {Math.round((successCount / results.length) * 100)}%
            </div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">신청 학점</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {totalCredits}학점
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">상태</TableHead>
              <TableHead>과목명</TableHead>
              <TableHead>결과 메시지</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.itemId}>
                <TableCell className="text-center">
                  <span className={`text-xl ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? '✓' : '✕'}
                  </span>
                </TableCell>
                <TableCell className="font-bold">
                  {result.subject?.name || "알 수 없는 과목"}
                </TableCell>
                <TableCell>
                  {result.success ? (
                    <Badge className="bg-green-600 hover:bg-green-700">신청 성공</Badge>
                  ) : (
                    <Badge variant="destructive">
                      신청 실패: {result.failReason}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 text-center">
        <Link to="/cart">
          <Button variant="outline">장바구니 수정하기</Button>
        </Link>
      </div>
    </div>
  );
};

export default SimulationResult;
