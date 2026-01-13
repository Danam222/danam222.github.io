import React from 'react';
import { Student, Factor } from '../types';
import { AlertCircle, Heart } from 'lucide-react';

interface Props {
  students: Student[];
  setStudents: (s: Student[]) => void;
  factors: Factor[];
}

const Step3Evaluate: React.FC<Props> = ({ students, setStudents, factors }) => {
  const toggleFactor = (studentId: string, factorId: string, type: 'difficulty' | 'helper') => {
    setStudents(students.map(student => {
      if (student.id !== studentId) return student;

      const targetList = type === 'difficulty' ? student.difficulties : student.helpers;
      const newList = targetList.includes(factorId)
        ? targetList.filter(id => id !== factorId)
        : [...targetList, factorId];

      return {
        ...student,
        [type === 'difficulty' ? 'difficulties' : 'helpers']: newList
      };
    }));
  };

  const difficultyFactors = factors.filter(f => f.type === 'difficulty');
  const helperFactors = factors.filter(f => f.type === 'helper');

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[600px]">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center">
          <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
          학생별 특성 체크
        </h2>
        <p className="text-slate-500 text-sm ml-11">
          각 학생에 해당하는 특성 요소를 체크해주세요. 이 데이터는 반 배정 알고리즘의 핵심 기준으로 사용됩니다.
        </p>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Header Row */}
        <div className="flex items-center bg-slate-50 border-b border-slate-200 p-4 text-sm font-bold text-slate-600">
          <div className="w-32 flex-shrink-0">이름</div>
          <div className="flex-1 grid grid-cols-2 gap-4">
             <div className="text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> 고려 요소</div>
             <div className="text-green-600 flex items-center"><Heart className="w-4 h-4 mr-1"/> 도움 요소</div>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
          {students.map((student) => (
            <div key={student.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
              <div className="w-32 flex-shrink-0 font-medium text-slate-800 truncate pr-2">
                {student.name}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4 border-l border-slate-100 pl-4">
                {/* Difficulties */}
                <div className="flex flex-wrap gap-2">
                  {difficultyFactors.length === 0 && <span className="text-xs text-slate-300">-</span>}
                  {difficultyFactors.map(f => (
                    <label key={f.id} className={`cursor-pointer inline-flex items-center px-2 py-1 rounded-md text-xs border transition-all select-none
                      ${student.difficulties.includes(f.id) 
                        ? 'bg-red-100 text-red-700 border-red-200 font-bold' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-red-200'}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={student.difficulties.includes(f.id)}
                        onChange={() => toggleFactor(student.id, f.id, 'difficulty')}
                      />
                      {f.label}
                    </label>
                  ))}
                </div>

                {/* Helpers */}
                <div className="flex flex-wrap gap-2 border-l border-slate-100 pl-4">
                  {helperFactors.length === 0 && <span className="text-xs text-slate-300">-</span>}
                  {helperFactors.map(f => (
                    <label key={f.id} className={`cursor-pointer inline-flex items-center px-2 py-1 rounded-md text-xs border transition-all select-none
                      ${student.helpers.includes(f.id) 
                        ? 'bg-green-100 text-green-700 border-green-200 font-bold' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-green-200'}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={student.helpers.includes(f.id)}
                        onChange={() => toggleFactor(student.id, f.id, 'helper')}
                      />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step3Evaluate;