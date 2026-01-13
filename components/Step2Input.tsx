import React, { useState } from 'react';
import { Student } from '../types';
import { Users, FileSpreadsheet, Trash2, UserPlus } from 'lucide-react';

interface Props {
  students: Student[];
  setStudents: (s: Student[]) => void;
}

const Step2Input: React.FC<Props> = ({ students, setStudents }) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('bulk');
  const [singleName, setSingleName] = useState('');

  const handleBulkAdd = () => {
    if (!inputText.trim()) return;

    const lines = inputText.split('\n');
    const newStudents: Student[] = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Handle tab separation (take first column as name)
        const parts = line.split('\t');
        const name = parts[0].trim();
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: name,
          difficulties: [],
          helpers: []
        };
      });

    setStudents([...students, ...newStudents]);
    setInputText('');
  };

  const handleSingleAdd = () => {
    if (!singleName.trim()) return;
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: singleName.trim(),
      difficulties: [],
      helpers: []
    };
    setStudents([...students, newStudent]);
    setSingleName('');
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6 h-[500px]">
        {/* Input Area */}
        <div className="flex flex-col bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
            학생 명단 입력
          </h2>
          
          <div className="flex space-x-2 mb-4 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'bulk' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileSpreadsheet className="w-4 h-4 inline mr-1" />
              엑셀 붙여넣기
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'manual' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <UserPlus className="w-4 h-4 inline mr-1" />
              직접 입력
            </button>
          </div>

          {activeTab === 'bulk' ? (
            <div className="flex-1 flex flex-col">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`엑셀에서 학생 이름을 복사하여 여기에 붙여넣으세요.\n(한 줄에 한 명씩 인식됩니다)`}
                className="flex-1 w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm font-mono"
              />
              <button
                onClick={handleBulkAdd}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                명단 추가하기
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSingleAdd()}
                  placeholder="학생 이름 입력"
                  className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleSingleAdd}
                  className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  추가
                </button>
              </div>
              <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-500 flex-1">
                한 명씩 이름을 입력하고 추가 버튼을 누르거나 엔터를 치세요.
              </div>
            </div>
          )}
        </div>

        {/* List Area */}
        <div className="flex flex-col bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              입력된 학생 목록
            </h3>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold">
              총 {students.length}명
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {students.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>등록된 학생이 없습니다.</p>
              </div>
            ) : (
              students.map((student, idx) => (
                <div key={student.id} className="group flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center">
                    <span className="text-slate-400 text-xs w-6 mr-2">#{idx + 1}</span>
                    <span className="font-medium text-slate-700">{student.name}</span>
                  </div>
                  <button
                    onClick={() => removeStudent(student.id)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          {students.length > 0 && (
             <button
             onClick={() => setStudents([])}
             className="mt-4 text-xs text-red-500 hover:text-red-700 underline text-right w-full"
           >
             전체 삭제
           </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Input;