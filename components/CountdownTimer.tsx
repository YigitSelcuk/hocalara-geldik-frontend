import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { examDateService } from '../services/homepage.service';
import { ExamDate } from '../types';

interface CountdownTimerProps {
    isStyle2?: boolean;
}

type ExamType = 'TYT' | 'AYT' | 'LGS';

const CountdownTimer: React.FC<CountdownTimerProps> = ({ isStyle2 = false }) => {
    const [selectedExam, setSelectedExam] = useState<ExamType>('TYT');
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [examDates, setExamDates] = useState<Record<string, Date>>({
        TYT: new Date('2025-06-14T09:00:00'),
        AYT: new Date('2025-06-15T09:00:00'),
        LGS: new Date('2025-06-01T09:00:00')
    });

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const response = await examDateService.getAll();
                console.log('📅 Fetched exam dates response:', response);
                
                // API returns { data: { success: true, data: [...] } }
                const apiData = response.data;
                console.log('📅 API data:', apiData);
                
                let examList = [];
                if (apiData?.data && Array.isArray(apiData.data)) {
                    examList = apiData.data;
                } else if (Array.isArray(apiData)) {
                    examList = apiData;
                }
                
                console.log('📅 Exam list:', examList);
                
                const dates: Record<string, Date> = { ...examDates };
                examList.forEach((d: ExamDate) => {
                    if (['TYT', 'AYT', 'LGS'].includes(d.examName)) {
                        // Parse the ISO date string directly without timezone conversion
                        // The date is stored as "YYYY-MM-DDTHH:mm:ss.sssZ"
                        const isoString = d.examDate;
                        // Extract date parts from ISO string
                        const [datePart, timePart] = isoString.split('T');
                        const [year, month, day] = datePart.split('-').map(Number);
                        const [hours, minutes] = timePart.split(':').map(Number);
                        
                        // Create date in local timezone with the exact values from database
                        const examDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
                        console.log(`📆 Setting ${d.examName} to:`, examDate);
                        dates[d.examName] = examDate;
                    }
                });
                console.log('✅ Final exam dates:', dates);
                setExamDates(dates);
            } catch (error) {
                console.error('Error fetching exam dates:', error);
            }
        };
        fetchDates();
    }, []);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const targetDate = examDates[selectedExam];
            if (!targetDate) return;
            const examDate = new Date(targetDate).getTime();
            const difference = examDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [selectedExam, examDates]);

    const primaryColor = isStyle2 ? 'bg-brand-warm-orange' : 'bg-brand-blue';
    const primaryColorText = isStyle2 ? 'text-brand-warm-orange' : 'text-brand-blue';
    const bgGradient = isStyle2 ? 'from-orange-50 to-amber-50' : 'from-blue-50 to-purple-50';

    const timeUnits = [
        { label: 'Gün', value: timeLeft.days },
        { label: 'Saat', value: timeLeft.hours },
        { label: 'Dakika', value: timeLeft.minutes },
        { label: 'Saniye', value: timeLeft.seconds }
    ];

    return (
        <div className="space-y-8">
            {/* Exam Selector */}
            <div className="flex items-center justify-center space-x-3">
                {(['TYT', 'AYT', 'LGS'] as ExamType[]).map((exam) => (
                    <button
                        key={exam}
                        onClick={() => setSelectedExam(exam)}
                        className={`px-6 py-3 rounded-xl font-black text-sm tracking-wider transition-all duration-300 ${selectedExam === exam
                            ? `${primaryColor} text-white shadow-xl scale-105`
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {exam}
                    </button>
                ))}
            </div>

            {/* Exam Info */}
            <div className={`bg-gradient-to-r ${bgGradient} rounded-[20px] p-6 text-center border border-white shadow-lg`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <Calendar className={`w-5 h-5 ${primaryColorText}`} />
                    <span className="text-sm font-bold text-slate-600">
                        {examDates[selectedExam].toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <Clock className={`w-4 h-4 ${primaryColorText}`} />
                    <span className="text-xs font-bold text-slate-500">
                        Saat {examDates[selectedExam].toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Countdown Display */}
            <div className="grid grid-cols-4 gap-4">
                {timeUnits.map((unit, index) => (
                    <div
                        key={unit.label}
                        className="relative group"
                    >
                        <div className={`bg-white rounded-[20px] p-6 text-center shadow-xl border-2 ${selectedExam === 'TYT' && !isStyle2 ? 'border-brand-blue/20' :
                            selectedExam === 'AYT' && !isStyle2 ? 'border-purple-500/20' :
                                selectedExam === 'LGS' && !isStyle2 ? 'border-brand-accent/20' :
                                    'border-brand-warm-orange/20'
                            } group-hover:scale-105 transition-all duration-300`}>
                            <div className={`text-4xl font-black ${primaryColorText} tracking-tighter mb-2 transition-all duration-500`}>
                                {String(unit.value).padStart(2, '0')}
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {unit.label}
                            </div>
                        </div>
                        {index < 3 && (
                            <div className={`absolute top-1/2 -right-2 transform -translate-y-1/2 text-2xl font-black ${primaryColorText}`}>
                                :
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Motivational Text */}
            <div className="text-center">
                <p className={`text-sm font-bold ${primaryColorText} tracking-wide`}>
                    {selectedExam} sınavına {timeLeft.days} gün kaldı! 💪
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    Her gün bir adım daha yaklaşıyorsun!
                </p>
            </div>
        </div>
    );
};

export default CountdownTimer;
