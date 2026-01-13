import React, { useState } from 'react';
import { Factor } from '../types';
import { Plus, X, AlertCircle, Heart } from 'lucide-react';

interface Props {
  classCount: number;
  setClassCount: (n: number) => void;
  factors: Factor[];
  setFactors: (f: Factor[]) => void;
}

const Step1Setup: React.FC<Props> = ({ classCount, setClassCount, factors, setFactors }) => {
  const [newDiff, setNewDiff] = useState('');
  const [newHelp, setNewHelp] = useState('');

  const addFactor = (label: string, type: 'difficulty' | 'helper') => {
    if (!label.trim()) return;
    const newFactor: Factor = {
      id: Math.random().toString(36).substr(2, 9),
      label: label.trim(),
      type
    };
    setFactors([...factors, newFactor]);
  };

  const removeFactor = (id: string) => {
    setFactors(factors.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
          학급 수 설정
        </h2>
        <div className="flex items-center space-x-4">
          <label className="text-slate-600 font-medium">배정할 총 반의 개수:</label>
          <input
            type="number"
            min="2"
            max="20"
            value={classCount}
            onChange={(e) => setClassCount(parseInt(e.target.value) || 2)}
            className="w-24 p-2 border border-slate-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <span className="text-slate-500 text-sm">반</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Difficulty Factors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            고려 요소 (어려움/지도 필요)
          </h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newDiff}
              onChange={(e) => setNewDiff(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    addFactor(newDiff, 'difficulty');
                    setNewDiff('');
                }
              }}
              placeholder="예: ADHD, 기초학력부진"
              className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
            />
            <button
              onClick={() => {
                addFactor(newDiff, 'difficulty');
                setNewDiff('');
              }}
              className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {factors.filter(f => f.type === 'difficulty').map(f => (
              <span key={f.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 border border-red-100">
                {f.label}
                <button onClick={() => removeFactor(f.id)} className="ml-2 hover:text-red-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {factors.filter(f => f.type === 'difficulty').length === 0 && (
              <p className="text-slate-400 text-sm italic">등록된 요소가 없습니다.</p>
            )}
          </div>
        </div>

        {/* Helper Factors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center text-green-600">
            <Heart className="w-5 h-5 mr-2" />
            도움 요소 (리더십/모범)
          </h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newHelp}
              onChange={(e) => setNewHelp(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    addFactor(newHelp, 'helper');
                    setNewHelp('');
                }
              }}
              placeholder="예: 회장경험, 성적우수"
              className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
            />
            <button
              onClick={() => {
                addFactor(newHelp, 'helper');
                setNewHelp('');
              }}
              className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {factors.filter(f => f.type === 'helper').map(f => (
              <span key={f.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-100">
                {f.label}
                <button onClick={() => removeFactor(f.id)} className="ml-2 hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {factors.filter(f => f.type === 'helper').length === 0 && (
              <p className="text-slate-400 text-sm italic">등록된 요소가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Setup;