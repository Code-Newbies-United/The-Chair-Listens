// pages/emergency.jsx
import Link from 'next/link';

export default function EmergencyPage() {
    const helplines = [
        { name: 'SADAG Mental Health Line', number: '011 234 4837', hours: '24/7' },
        { name: 'Suicide Crisis Helpline', number: '0800 567 567', hours: '24/7' },
        { name: 'LifeLine South Africa', number: '0861 322 322', hours: '24/7' },
        { name: 'Cipla Mental Health Helpline', number: '0800 456 789', hours: '24/7' },
        { name: 'Emergency', number: '112', hours: '24/7' },
    ];

    return (
        <div className="min-h-screen bg-red-950 text-white p-6 flex flex-col items-center justify-center">
            <div className="max-w-xl w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-red-400 mb-2">You Are Not Alone</h1>
                    <p className="text-slate-300">
                        If you or someone you know is going through a difficult time or in immediate danger, please reach out for help right now.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    {helplines.map((line, index) => (
                        <div key={index} className="flex justify-between items-center p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                            <div>
                                <h3 className="font-semibold text-lg">{line.name}</h3>
                                <span className="text-xs text-slate-400">{line.hours}</span>
                            </div>
                            <a
                                href={`tel:${line.number.replace(/\s+/g, '')}`}
                                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition"
                            >
                                Call {line.number}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center space-x-4">
                    <Link
                        href="/"
                        className="text-slate-400 hover:text-white underline text-sm"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}