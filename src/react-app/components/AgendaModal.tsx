import { useEffect } from 'react';
import { X, Calendar, Users } from 'lucide-react';

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgendaModal({ isOpen, onClose }: AgendaModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const day1Schedule = [
    {
      time: "9:00 AM - 10:00 AM",
      title: "Conference Opening",
      speaker: "",
      location: "Main Conference Room",
      type: "keynote"
    },
    {
      time: "10:00 AM - 11:00 AM",
      title: "Credentia Before and After",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    },
    {
      time: "11:00 AM - 12:00 PM",
      title: "Optimizing Workforce Operations",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    },
    {
      time: "12:00 PM - 1:30 PM",
      title: "Networking Lunch",
      speaker: "",
      location: "Dining Room",
      type: "networking"
    },
    {
      time: "1:30 PM - 2:30 PM",
      title: "Operational Enhancements",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    },
    {
      time: "2:30 PM - 3:30 PM",
      title: "Technological Evolution of Credentia",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    },
    {
      time: "3:30 PM - 4:30 PM",
      title: "Way Forward: Practice Skills Demo",
      speaker: "",
      location: "Main Conference Room",
      type: "demo"
    }
  ];

  const day2Schedule = [
    {
      time: "9:00 AM - 10:00 AM",
      title: "Psychometric Analysis of the NNAAP and MACE Exams",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    },
    {
      time: "10:00 AM - 11:00 AM",
      title: "Curriculum and Nationalizing Examinations",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    },
    {
      time: "11:00 AM - 12:00 PM",
      title: "SME's & Curriculum",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    },
    {
      time: "12:00 PM - 1:30 PM",
      title: "Networking Lunch",
      speaker: "",
      location: "Dining Room",
      type: "networking"
    },
    {
      time: "1:30 PM - 2:30 PM",
      title: "Job Task Analysis",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    },
    {
      time: "2:30 PM - 3:30 PM",
      title: "ExamRoom.AI & Tech Might",
      speaker: "",
      location: "Main Conference Room",
      type: "presentation"
    }
  ];



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(28, 117, 188, 1)' }}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium heading-color">
                  Conference Agenda
                </h2>
                <p className="text-base description-color">November 6-7, 2025 • Greater Orlando Area</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Day 1 */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(28, 117, 188, 1)' }}>
                  <span className="text-white font-bold text-base">1</span>
                </div>
                <h3 className="text-2xl font-bold heading-color">
                  Day 1 - November 6, 2025
                </h3>
              </div>

              <div className="space-y-3">
                {day1Schedule.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 hover:shadow-sm transition-all border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium heading-color">{item.title}</h4>
                          </div>
                          {item.speaker && (
                            <p className="text-credentia-500 text-base font-medium mb-1">
                              {item.speaker}
                            </p>
                          )}

                        </div>
                      </div>
                      <div className="description-color font-medium text-base ml-4">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day 2 */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(28, 117, 188, 1)' }}>
                  <span className="text-white font-bold text-base">2</span>
                </div>
                <h3 className="text-2xl font-bold heading-color">
                  Day 2 - November 7, 2025
                </h3>
              </div>

              <div className="space-y-3">
                {day2Schedule.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 hover:shadow-sm transition-all border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium heading-color">{item.title}</h4>
                          </div>
                          {item.speaker && (
                            <p className="text-credentia-500 text-base font-medium mb-1">
                              {item.speaker}
                            </p>
                          )}

                        </div>
                      </div>
                      <div className="description-color font-medium text-base ml-4">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <h4 className="font-medium heading-color mb-1">Special Guest Speakers</h4>
                  <ul className="text-base description-color space-y-1">
                    <li>• Henry Sorenson - President, Prov, Inc.</li>
                    <li>• Brian Syzdek - Senior Psychometrician | Psychologist, Prov, Inc.</li>
                    <li>• David Cox - President, Professional Testing, Inc. (PTI)</li>
                    <li>• Reed Castle - Executive Vice President, Professional Testing, Inc. (PTI)</li>
                    <li>• Vicky Castillo - Owner, FACETS Healthcare</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
