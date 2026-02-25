import React from 'react';

// Design reference only - not used in production (AppShell is the active component)
const TimebankHome: React.FC = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">update</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">Timebank</h1>
                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Versjon 2.4.0</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold" href="#">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Dashboard</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors" href="#">
                        <span className="material-symbols-outlined">bar_chart</span>
                        <span>Rapporter</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors" href="#">
                        <span className="material-symbols-outlined">work</span>
                        <span>Prosjekter</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors" href="#">
                        <span className="material-symbols-outlined">settings</span>
                        <span>Innstillinger</span>
                    </a>
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-2 mb-4">
                        <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                            <img alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfblRzL-DRcm9F38kGeyLOUMTFdEu-P_0MTXEJ5BAPHMbvmJtwRVnYZkkWWVSmeZ4ZqkHwvY00SeZO9BrPZeL5hot8ZwkCT-jjC-tlMOxzQ7EBwcZuQ9OPqXOdDuEUVUi-EVpsY_Uc_FQiiKWaq41I3ms2REFG1770VscjsFmxX5ZkFQwEcfJibDlf64DsFvhANawB55Z80hFd6SDzicuk3fJEIY1VfmDqYMW2xZmHo3IycdRvuHCqhMKeecvIShRvYKsZvuW-jkSW" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">Marius Jensen</p>
                            <p className="text-xs text-slate-500 truncate">marius@studio.no</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Logg ut
                    </button>
                </div>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header & Weekly Summary */}
                <header className="bg-white border-b border-slate-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">Min tidsbank</h2>
                            <p className="text-slate-500 font-medium">Uke 42 • 14. - 20. Oktober</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-900 hover:bg-slate-200 transition-all">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                Denne uken
                            </button>
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Ny føring
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-4">
                        {/* Progress Cards */}
                        <div className="col-span-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ukentlig fremdrift</p>
                                    <p className="text-2xl font-black text-slate-900">32.5 <span className="text-slate-400 font-medium">/ 40 timer</span></p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                        <span className="material-symbols-outlined text-xs mr-1">trending_up</span> +2%
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[81%] rounded-full"></div>
                            </div>
                        </div>
                        {/* Daily Mini Bars */}
                        <div className="col-span-4 flex justify-between gap-2 px-2 items-end pb-1">
                            {/* Mon */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <div className="w-full bg-primary/20 rounded-t-sm relative h-24 overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-primary h-[90%]"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">MAN</span>
                            </div>
                            {/* Tue */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <div className="w-full bg-primary/20 rounded-t-sm relative h-24 overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-primary h-[30%]"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">TIR</span>
                            </div>
                            {/* Wed */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <div className="w-full bg-primary/20 rounded-t-sm relative h-24 overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-primary h-[100%]"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">ONS</span>
                            </div>
                            {/* Thu */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <div className="w-full bg-primary/20 rounded-t-sm relative h-24 overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-primary h-[30%]"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">TOR</span>
                            </div>
                            {/* Fri */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <div className="w-full bg-primary/20 rounded-t-sm relative h-24 overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-primary h-[80%]"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">FRE</span>
                            </div>
                            {/* Sat */}
                            <div className="flex flex-col items-center gap-2 flex-1 opacity-40">
                                <div className="w-full bg-slate-200 rounded-t-sm h-24"></div>
                                <span className="text-[10px] font-bold text-slate-400">LØR</span>
                            </div>
                            {/* Sun */}
                            <div className="flex flex-col items-center gap-2 flex-1 opacity-40">
                                <div className="w-full bg-slate-200 rounded-t-sm h-24"></div>
                                <span className="text-[10px] font-bold text-slate-400">SØN</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 overflow-hidden">
                    {/* Timeline Center */}
                    <div className="flex-1 overflow-y-auto p-8 relative">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">Dagens tidslinje — <span className="font-medium text-slate-500">Onsdag 16. Okt</span></h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="size-2 rounded-full bg-primary"></span> Ført tid
                                    <span className="size-2 rounded-full border border-slate-300 ml-4"></span> Ledig tid
                                </div>
                            </div>
                            <div className="space-y-0 relative timeline-line">
                                {/* Timeline Entry */}
                                <div className="relative pl-14 pb-8 group">
                                    <div className="absolute left-0 top-0 size-10 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white z-10">
                                        <span className="material-symbols-outlined text-xl">schedule</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">PRJ-102</span>
                                                    <h4 className="text-base font-bold">Designsystem</h4>
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium">08:00 - 10:00 <span className="text-slate-300 mx-1">•</span> 2 timer</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><span className="material-symbols-outlined text-lg">edit</span></button>
                                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><span className="material-symbols-outlined text-lg">delete</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Empty Gap */}
                                <div className="relative pl-14 pb-8 group">
                                    <div className="absolute left-0 top-0 size-10 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 ring-4 ring-white z-10 group-hover:border-primary group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">add_circle</span>
                                    </div>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex items-center justify-between hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-400 group-hover:text-primary">Ledig tid</h4>
                                            <p className="text-xs text-slate-400">10:00 - 10:30 <span className="text-slate-300 mx-1">•</span> 30 min</p>
                                        </div>
                                        <button className="text-xs font-bold text-primary px-3 py-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors">Fyll ut</button>
                                    </div>
                                </div>
                                {/* Timeline Entry */}
                                <div className="relative pl-14 pb-8 group">
                                    <div className="absolute left-0 top-0 size-10 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white z-10">
                                        <span className="material-symbols-outlined text-xl">groups</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">PRJ-105</span>
                                                    <h4 className="text-base font-bold">Møte: Produkt</h4>
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium">10:30 - 11:30 <span className="text-slate-300 mx-1">•</span> 1 time</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><span className="material-symbols-outlined text-lg">edit</span></button>
                                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><span className="material-symbols-outlined text-lg">delete</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Empty Gap */}
                                <div className="relative pl-14 pb-8 group">
                                    <div className="absolute left-0 top-0 size-10 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 ring-4 ring-white z-10 group-hover:border-primary group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">add_circle</span>
                                    </div>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex items-center justify-between hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-400 group-hover:text-primary">Ledig tid</h4>
                                            <p className="text-xs text-slate-400">11:30 - 12:00 <span className="text-slate-300 mx-1">•</span> 30 min</p>
                                        </div>
                                        <button className="text-xs font-bold text-primary px-3 py-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors">Fyll ut</button>
                                    </div>
                                </div>
                                {/* Timeline Entry */}
                                <div className="relative pl-14 pb-8 group">
                                    <div className="absolute left-0 top-0 size-10 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white z-10">
                                        <span className="material-symbols-outlined text-xl">schedule</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">PRJ-102</span>
                                                    <h4 className="text-base font-bold">Designsystem</h4>
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium">12:00 - 16:00 <span className="text-slate-300 mx-1">•</span> 4 timer</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><span className="material-symbols-outlined text-lg">edit</span></button>
                                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><span className="material-symbols-outlined text-lg">delete</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Keyboard Shortcut Hint */}
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-300 text-[11px] font-bold px-4 py-2 rounded-full flex gap-4 shadow-2xl z-50">
                            <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">N</kbd> Ny føring</span>
                            <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">S</kbd> Lagre</span>
                            <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">/</kbd> Søk prosjekt</span>
                            <span className="flex items-center gap-1.5"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">ESC</kbd> Lukk</span>
                        </div>
                    </div>
                    {/* Right Action Panel */}
                    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4">Hurtiginnføring</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Varighet</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button className="py-2 text-xs font-bold rounded-lg border border-slate-200 hover:border-primary hover:text-primary transition-all active:scale-95">15m</button>
                                        <button className="py-2 text-xs font-bold rounded-lg border border-slate-200 hover:border-primary hover:text-primary transition-all active:scale-95">30m</button>
                                        <button className="py-2 text-xs font-bold rounded-lg border border-slate-200 hover:border-primary hover:text-primary transition-all active:scale-95">1t</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Velg Prosjekt</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                        <input className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border-slate-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="Søk kode eller navn..." type="text" />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Siste prosjekter</label>
                                    <div className="space-y-2">
                                        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                                            <div className="size-8 flex-shrink-0 bg-primary/10 rounded flex items-center justify-center text-primary text-[10px] font-black group-hover:bg-primary group-hover:text-white">102</div>
                                            <div className="text-left overflow-hidden">
                                                <p className="text-xs font-bold truncate">Designsystem</p>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-tight">PRJ-102</p>
                                            </div>
                                        </button>
                                        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                                            <div className="size-8 flex-shrink-0 bg-primary/10 rounded flex items-center justify-center text-primary text-[10px] font-black group-hover:bg-primary group-hover:text-white">105</div>
                                            <div className="text-left overflow-hidden">
                                                <p className="text-xs font-bold truncate">Produktmøte</p>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-tight">PRJ-105</p>
                                            </div>
                                        </button>
                                        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                                            <div className="size-8 flex-shrink-0 bg-primary/10 rounded flex items-center justify-center text-primary text-[10px] font-black group-hover:bg-primary group-hover:text-white">098</div>
                                            <div className="text-left overflow-hidden">
                                                <p className="text-xs font-bold truncate">Backend Refactoring</p>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-tight">PRJ-098</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 mb-4">Statistikk denne uken</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Billable hours</span>
                                    <span className="font-bold text-emerald-600">28.0 (86%)</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Internal hours</span>
                                    <span className="font-bold text-slate-700">4.5 (14%)</span>
                                </div>
                                <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                                    <span className="text-slate-900 font-bold">Total tid</span>
                                    <span className="font-black text-slate-900">32.5 timer</span>
                                </div>
                            </div>
                            <div className="mt-auto bg-primary/5 rounded-xl p-4 border border-primary/10">
                                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Tips</p>
                                <p className="text-xs text-slate-600 leading-relaxed">Trykk <kbd className="px-1 bg-white border border-slate-200 rounded">D</kbd> for å bytte mellom daglig og ukentlig visning.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default TimebankHome;
