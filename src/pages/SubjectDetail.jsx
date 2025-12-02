import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectDetails, mockCartItems } from '../utils/mockData';

const SubjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const subject = getSubjectDetails(id);

    if (!subject) {
        return <div className="container">과목을 찾을 수 없습니다.</div>;
    }

    const handleAddToCart = () => {
        // In a real app, API call to add to cart
        alert(`${subject.name} 과목이 장바구니에 담겼습니다!`);
        navigate('/cart');
    };

    return (
        <div className="animate-fade-in">
            <div className="object-header">
                <div className="container">
                    <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '1rem', border: 'none', paddingLeft: 0 }}>
                        ← 뒤로가기
                    </button>
                    <div className="flex-between">
                        <div>
                            <h1 className="object-header-title">{subject.name}</h1>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div className="object-attribute">
                                    <span className="object-attribute-label">과목코드</span>
                                    <span className="object-attribute-text">{subject.subjectId}</span>
                                </div>
                                <div className="object-attribute">
                                    <span className="object-attribute-label">이수구분</span>
                                    <span className="object-attribute-text">
                                        <span className={subject.isMajor ? "object-status status-success" : "object-status status-neutral"}>
                                            {subject.isMajor ? "전공" : "교양"}
                                        </span>
                                    </span>
                                </div>
                                <div className="object-attribute">
                                    <span className="object-attribute-label">담당교수</span>
                                    <span className="object-attribute-text">{subject.professorName}</span>
                                </div>
                                <div className="object-attribute">
                                    <span className="object-attribute-label">학점</span>
                                    <span className="object-attribute-text">{subject.credits}학점</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={handleAddToCart}>
                                장바구니 담기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="sap-card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>강의 정보</h3>
                    <div className="grid-layout">
                        <div className="object-attribute">
                            <span className="object-attribute-label">시간</span>
                            <span className="object-attribute-text">{subject.day} {subject.startTime} - {subject.endTime}</span>
                        </div>
                        <div className="object-attribute">
                            <span className="object-attribute-label">강의실</span>
                            <span className="object-attribute-text">{subject.room}</span>
                        </div>
                        <div className="object-attribute">
                            <span className="object-attribute-label">정원</span>
                            <span className="object-attribute-text">{subject.currentStudents} / {subject.maxStudents} 명</span>
                        </div>
                        <div className="object-attribute">
                            <span className="object-attribute-label">경쟁률</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    width: '100px',
                                    height: '8px',
                                    background: '#e5e5e5',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${(subject.currentStudents / subject.maxStudents) * 100}%`,
                                        height: '100%',
                                        background: subject.currentStudents >= subject.maxStudents ? 'var(--danger)' : 'var(--success)'
                                    }} />
                                </div>
                                <span className="object-status status-neutral">
                                    {Math.round((subject.currentStudents / subject.maxStudents) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectDetail;
