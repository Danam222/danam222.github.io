import { ClassGroup, Factor } from '../types';

export const exportToCSV = (groups: ClassGroup[], factors: Factor[]) => {
  // BOM for Korean characters in Excel
  const BOM = '\uFEFF'; 
  
  let csvContent = BOM + "반,학생 이름,특성 요약\n";

  groups.forEach((group) => {
    group.students.forEach((student) => {
      const studentFactors = [
        ...student.difficulties.map(d => factors.find(f => f.id === d)?.label).filter(Boolean),
        ...student.helpers.map(h => factors.find(f => f.id === h)?.label).filter(Boolean)
      ].join(', ');

      // Escape quotes if necessary
      const safeName = `"${student.name.replace(/"/g, '""')}"`;
      const safeFactors = `"${studentFactors.replace(/"/g, '""')}"`;
      
      csvContent += `${group.name},${safeName},${safeFactors}\n`;
    });
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `반배정결과_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};