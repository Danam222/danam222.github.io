import React, { useState } from 'react';
import { Factor, Student } from './types';
import Step1Setup from './components/Step1Setup';
import Step2Input from './components/Step2Input';
import Step3Evaluate from './components/Step3Evaluate';
import Step4Result from './components/Step4Result';
import { ChevronRight, ChevronLeft, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [classCount, setClassCount] = useState(3);
  const [factors, setFactors] = useState<Factor[]>([
    { id: 'd1', label: '학습부진', type: 'difficulty' },
    { id: 'd2', label: '행동주의', type: 'difficulty' },
    { id: 'h1', label: '리더십', type: 'helper' },
  ]);
  const [students, setStudents] = useState<Student[]>([]);

  const nextStep = () => {
    if (step === 2 && students.length === 0) {
      alert("최소 1명 이상의 학생을 입력해주세요.");
      return;
    }
    setStep(Math.min(4, step + 1));
  };

  const prevStep = () => setStep(Math.max(1, step - 1));

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
               <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">ClassMate Builder</h1>
              <p className="text-xs text-slate-500">스마트 반 배정 시스템</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                    ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}
                  `}
                >
                  {s}
                </div>
                {s !== 4 && <div className={`w-8 h-1 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden p-6 bg-slate-50">
          <div className="h-full max-w-4xl mx-auto">
            {step === 1 && (
              <Step1Setup 
                classCount={classCount} 
                setClassCount={setClassCount} 
                factors={factors}
                setFactors={setFactors}
              />
            )}
            {step === 2 && (
              <Step2Input 
                students={students} 
                setStudents={setStudents} 
              />
            )}
            {step === 3 && (
              <Step3Evaluate 
                students={students} 
                setStudents={setStudents} 
                factors={factors} 
              />
            )}
            {step === 4 && (
              <Step4Result 
                students={students} 
                factors={factors} 
                classCount={classCount} 
              />
            )}
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="bg-white border-t border-slate-200 p-6 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center px-6 py-2.5 rounded-lg font-medium transition-all
              ${step === 1 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'}
            `}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            이전 단계
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
            >
              다음 단계
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="text-slate-500 hover:text-indigo-600 font-medium text-sm underline"
            >
              처음부터 다시하기
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default App;