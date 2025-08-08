import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Agenda() {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  const schedule = [
    {
      day: 'Day 1',
      date: 'November 6, 2025',
      subtitle: 'Foundation & Innovation',
      sessions: [
        { time: '8:00 AM - 9:00 AM', title: 'Conference Opening', speaker: null },
        { time: '9:00 AM - 10:30 AM', title: 'Credentia Before and After', speaker: null },
        { time: '10:45 AM - 12:00 PM', title: 'Optimizing Workforce Operations', speaker: null },
        { time: '12:00 PM - 1:30 PM', title: 'Lunch Break', speaker: null },
        { time: '1:30 PM - 3:00 PM', title: 'Operational Enhancements', speaker: null },
        { time: '3:15 PM - 4:45 PM', title: 'Technological Evolution of Credentia', speaker: null },
        { time: '5:00 PM - 6:30 PM', title: 'Way Forward: Practice Skills Demo', speaker: null }
      ]
    },
    {
      day: 'Day 2',
      date: 'November 7, 2025',
      subtitle: 'Analysis & Technology',
      sessions: [
        { time: '8:00 AM - 9:30 AM', title: 'Psychometric Analysis of the NNAAP and MACE Exams', speaker: null },
        { time: '9:45 AM - 11:15 AM', title: 'Curriculum and Nationalizing Examinations', speaker: null },
        { time: '11:30 AM - 1:00 PM', title: 'SME\'s & Curriculum', speaker: null },
        { time: '1:00 PM - 2:30 PM', title: 'Lunch Break', speaker: null },
        { time: '2:30 PM - 4:00 PM', title: 'Job Task Analysis', speaker: null },
        { time: '4:15 PM - 5:45 PM', title: 'ExamRoom.AI & Tech Might', speaker: null }
      ]
    }
  ];

  const toggleDay = (dayIndex: number) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-credentia-100 text-credentia-700 text-base font-medium mb-6">
              <span className="w-2 h-2 bg-credentia-500 rounded-full mr-2"></span>
              November 6-7, 2025
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Conference
              <span className="text-credentia-500 block">Agenda</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              November 6-7, 2025 • Greater Orlando Area
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-[rgba(234,236,240,var(--tw-bg-opacity))] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Accordion Timeline */}
          <div className="space-y-6">
            {schedule.map((day, dayIndex) => (
              <div key={dayIndex} className="relative">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleDay(dayIndex)}
                  className="w-full bg-white rounded-2xl p-6 hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-credentia-500 rounded-2xl flex items-center justify-center mr-6">
                        <span className="text-2xl font-bold text-white">{dayIndex + 1}</span>
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-bold text-slate-900">{day.day}</h2>
                        <p className="text-lg text-slate-600">{day.date}</p>
                        <p className="text-base text-credentia-600 font-medium">{day.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedDay === dayIndex ? (
                        <ChevronUp className="w-6 h-6 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Accordion Content */}
                {expandedDay === dayIndex && (
                  <div className="mt-4 ml-6 animate-in slide-in-from-top-2 duration-300">
                    {/* Timeline Line for Sessions */}
                    <div className="relative">
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-credentia-200"></div>
                      
                      <div className="space-y-4">
                        {day.sessions.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="relative">
                            {/* Session Dot */}
                            <div className="absolute left-6 top-8 w-4 h-4 bg-credentia-500 rounded-full border-4 border-white z-10"></div>
                            
                            {/* Session Content */}
                            <div className="ml-16 p-6 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-slate-900 text-base mb-2">{session.title}</h3>
                                  {session.speaker && (
                                    <p className="text-base text-credentia-500">{session.speaker}</p>
                                  )}
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                  <span className="inline-block px-3 py-1 bg-credentia-100 text-credentia-600 text-sm font-medium rounded-full">
                                    {session.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}