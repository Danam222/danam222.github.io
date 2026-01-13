import React, { useEffect, useState } from 'react';
import { Student, Factor, ClassGroup } from '../types';
import { exportToCSV } from '../utils/csvHelper';
import { Download, RefreshCw, AlertCircle, Heart } from 'lucide-react';

interface Props {
  students: Student[];
  factors: Factor[];
  classCount: number;
}

const Step4Result: React.FC<Props> = ({ students, factors, classCount }) => {
  const [groups, setGroups] = useState<ClassGroup[]>([]);
  const [isCalculating, setIsCalculating] = useState(true);

  const calculateDistribution = () => {
    setIsCalculating(true);
    
    // Simulate slight delay for UX
    setTimeout(() => {
      // 1. Initialize Groups
      const newGroups: ClassGroup[] = Array.from({ length: classCount }, (_, i) => ({
        id: i + 1,
        name: `${i + 1}반`,
        students: [],
        stats: { total: 0, difficultyScore: 0, helperScore: 0 }
      }));

      // 2. Sorting Logic
      // Priority: Most difficulties first (hardest to place), then helpers.
      const sortedStudents = [...students].sort((a, b) => {
        const diffA = a.difficulties.length;
        const diffB = b.difficulties.length;
        if (diffB !== diffA) return diffB - diffA; // More difficulties first

        const helpA = a.helpers.length;
        const helpB = b.helpers.length;
        return helpB - helpA; // More helpers first
      });

      // 3. Snake Draft Distribution
      sortedStudents.forEach((student, index) => {
        // Snake pattern: 0, 1, 2, 2, 1, 0, 0, 1, 2...
        const cycle = Math.floor(index / classCount);
        const isSnakeBack = cycle % 2 === 1;
        const groupIndex = isSnakeBack 
          ? classCount - 1 - (index % classCount)
          : index % classCount;

        newGroups[groupIndex].students.push(student);
      });

      // 4. Calculate Stats
      newGroups.forEach(g => {
        g.stats.total = g.students.length;
        g.stats.difficultyScore = g.students.reduce((acc, s) => acc + s.difficulties.length, 0);
        g.stats.helperScore = g.students.reduce((acc, s) => acc + s.helpers.length, 0);
      });

      setGroups(newGroups);
      setIsCalculating(false);
    }, 800);
  };

  useEffect(() => {
    calculateDistribution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] animate-fade-in">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-slate-600">최적의 반 배정 결과를 계산 중입니다...</p>
        <p className="text-sm text-slate-400 mt-2">학생 수와 특성을 고려하여 균형을 맞추고 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in h-[600px] flex flex-col">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
            반 배정 결과
          </h2>
          <p className="text-slate-500 text-sm mt-1 ml-11">
             총 {students.length}명의 학생이 {classCount}개 학급으로 배정되었습니다.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={calculateDistribution}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            재배정
          </button>
          <button 
            onClick={() => exportToCSV(groups, factors)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            엑셀 저장
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2">
        <div className="flex space-x-4 h-full" style={{ minWidth: `${classCount * 300}px` }}>
          {groups.map((group) => (
            <div key={group.id} className="w-80 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-indigo-900">{group.name}</h3>
                  <span className="text-sm font-medium text-slate-500">{group.students.length}명</span>
                </div>
                <div className="flex space-x-4 text-xs">
                  <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
                    <AlertCircle className="w-3 h-3 mr-1" /> {group.stats.difficultyScore}
                  </span>
                  <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                    <Heart className="w-3 h-3 mr-1" /> {group.stats.helperScore}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {group.students.map((student) => (
                  <div key={student.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-indigo-100 transition-colors">
                    <div className="font-medium text-slate-800">{student.name}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {student.difficulties.map(dId => {
                         const f = factors.find(f => f.id === dId);
                         return f ? <span key={dId} className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">{f.label}</span> : null;
                      })}
                      {student.helpers.map(hId => {
                         const f = factors.find(f => f.id === hId);
                         return f ? <span key={hId} className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">{f.label}</span> : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4Result;