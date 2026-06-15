import { motion } from 'motion/react';
import { Target, BarChart3, Scan, Droplets, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { FluidParticlesBackground } from './ui/fluid-particles-background';

export default function FeatureCards() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)' }}>
                <FluidParticlesBackground particleCount={800} />
            </div>

            <div className="mx-auto max-w-3xl lg:max-w-6xl px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <h2 className="text-[#4ade80] font-semibold text-xs uppercase tracking-[0.3em] mb-4">What We Provide</h2>
                    <h3 className="text-4xl sm:text-5xl font-semibold text-[#F8FAF6] tracking-tight leading-tight">AI-Powered <br /> <span className="text-[#d97706] font-light italic">Plantation Intelligence.</span></h3>
                </motion.div>

                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-6">
                        {/* Card 1: AI Object Detection */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="col-span-full lg:col-span-2 flex"
                        >
                            <Card className="relative w-full flex overflow-hidden !bg-white/[0.02] backdrop-blur-3xl !border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] hover:!bg-white/[0.05] hover:!border-white/[0.12] transition-all duration-500 group">
                                <CardContent className="relative m-auto size-fit pt-8 pb-6 flex flex-col items-center justify-center">
                                    <div className="relative flex h-40 w-full items-center justify-center">
                                        <div className="relative size-24 border-2 border-dashed border-[#4ade80]/40 rounded-xl flex items-center justify-center group-hover:border-[#4ade80]/60 transition-colors">
                                            {/* Bounding Box Corners */}
                                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#4ade80]" />
                                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#4ade80]" />
                                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#4ade80]" />
                                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#4ade80]" />

                                            <Scan className="size-10 text-[#4ade80] animate-pulse" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <h2 className="mt-8 text-center text-xl font-semibold tracking-tight text-[#F8FAF6]">AI Object Detection</h2>
                                    <p className="mt-3 text-center text-sm font-light text-white/60 leading-relaxed">Pinpoint individual oil palm crowns instantly using our custom RetinaNet models.</p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 2: Tree Health Classification */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="col-span-full sm:col-span-3 lg:col-span-2"
                        >
                            <Card className="relative h-full overflow-hidden !bg-white/[0.02] backdrop-blur-3xl !border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] hover:!bg-white/[0.05] hover:!border-white/[0.12] transition-all duration-500 group">
                                <CardContent className="pt-8 flex flex-col h-full">
                                    <div className="relative mx-auto flex aspect-square size-48 rounded-full border border-white/[0.03] bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex-col justify-center items-center overflow-hidden">
                                        <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                                            {/* Healthy */}
                                            <div className="relative size-14 border border-dashed border-[#4ade80]/40 rounded-md flex items-center justify-center group-hover:border-[#4ade80]/70 transition-colors">
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#4ade80]" />
                                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#4ade80]" />
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#4ade80]" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#4ade80]" />
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#4ade80] text-[#011712] text-[7px] font-bold px-1.5 py-0.5 rounded uppercase whitespace-nowrap z-10 shadow-sm">Healthy</div>
                                            </div>
                                            {/* Yellow */}
                                            <div className="relative size-14 border border-dashed border-[#f59e0b]/40 rounded-md flex items-center justify-center group-hover:border-[#f59e0b]/70 transition-colors mt-2">
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#f59e0b]" />
                                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#f59e0b]" />
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#f59e0b]" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#f59e0b]" />
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-[#011712] text-[7px] font-bold px-1.5 py-0.5 rounded uppercase whitespace-nowrap z-10 shadow-sm">Yellow</div>
                                            </div>
                                            {/* Small */}
                                            <div className="relative size-14 border border-dashed border-[#3b82f6]/40 rounded-md flex items-center justify-center group-hover:border-[#3b82f6]/70 transition-colors -mt-2">
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#3b82f6]" />
                                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#3b82f6]" />
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#3b82f6]" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#3b82f6]" />
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#3b82f6] text-white text-[7px] font-bold px-1.5 py-0.5 rounded uppercase whitespace-nowrap z-10 shadow-sm">Small</div>
                                            </div>
                                            {/* Dead */}
                                            <div className="relative size-14 border border-dashed border-[#ef4444]/40 rounded-md flex items-center justify-center group-hover:border-[#ef4444]/70 transition-colors">
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ef4444]" />
                                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ef4444]" />
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ef4444]" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ef4444]" />
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#ef4444] text-white text-[7px] font-bold px-1.5 py-0.5 rounded uppercase whitespace-nowrap z-10 shadow-sm">Dead</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-10 mt-6 space-y-2 text-center flex-1">
                                        <h2 className="text-xl font-semibold text-[#F8FAF6]">Tree Health Classification</h2>
                                        <p className="text-white/60 font-light text-sm leading-relaxed">Automatically grade each tree into Healthy, Yellowing, Small Canopy, or Dead categories to enable rapid and highly targeted agronomic interventions.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 3: Automated Analysis */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                            className="col-span-full sm:col-span-3 lg:col-span-2"
                        >
                            <Card className="relative h-full overflow-hidden !bg-white/[0.02] backdrop-blur-3xl !border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] hover:!bg-white/[0.05] hover:!border-white/[0.12] transition-all duration-500 group">
                                <CardContent className="pt-6 flex flex-col h-full">
                                    <div className="relative pt-8 flex justify-center lg:px-6">
                                        <div className="flex items-center gap-8">
                                            {/* Donut Chart */}
                                            <div className="relative size-32 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.15)] ring-1 ring-white/[0.05]"
                                                style={{ 
                                                    background: 'conic-gradient(#4ade80 0% 65%, #f59e0b 65% 80%, #3b82f6 80% 90%, #ef4444 90% 100%)'
                                                }}>
                                                {/* Inner Hole for Donut */}
                                                <div className="absolute size-24 bg-[#0a1815] rounded-full flex flex-col items-center justify-center border border-white/[0.02] shadow-inner">
                                                    <span className="text-2xl font-bold text-white tracking-tight">845</span>
                                                    <span className="text-[9px] text-white/50 uppercase tracking-widest mt-0.5">Trees</span>
                                                </div>
                                            </div>
                                            
                                            {/* Legend */}
                                            <div className="flex flex-col gap-3 border-l border-white/5 pl-6 py-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-[3px] bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.4)]"></div>
                                                    <span className="text-xs font-medium text-white/70 w-14">Healthy</span>
                                                    <span className="text-xs font-bold text-white">65%</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-[3px] bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                                                    <span className="text-xs font-medium text-white/70 w-14">Yellow</span>
                                                    <span className="text-xs font-bold text-white">15%</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-[3px] bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                                                    <span className="text-xs font-medium text-white/70 w-14">Small</span>
                                                    <span className="text-xs font-bold text-white">10%</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-[3px] bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                                                    <span className="text-xs font-medium text-white/70 w-14">Dead</span>
                                                    <span className="text-xs font-bold text-white">10%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-10 mt-10 space-y-2 text-center flex-1">
                                        <h2 className="text-xl font-semibold text-[#F8FAF6]">Automated Analysis</h2>
                                        <p className="text-white/60 font-light text-sm leading-relaxed">Transform raw drone imagery into comprehensive statistical reports, providing clear pie charts and actionable metrics for estate-wide monitoring.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 4: VRA Recommendation */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                            className="col-span-full lg:col-span-3"
                        >
                            <Card className="relative overflow-hidden h-full !bg-white/[0.02] backdrop-blur-3xl !border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] hover:!bg-white/[0.05] hover:!border-white/[0.12] transition-all duration-500 group">
                                <CardContent className="grid h-full pt-8 sm:grid-cols-2 gap-8">
                                    <div className="relative z-10 flex flex-col justify-center space-y-6">
                                        <div className="relative flex aspect-square size-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[#4ade80] items-center justify-center group-hover:bg-[#10b981]/10 transition-colors duration-500">
                                            <Target className="size-6" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-3">
                                            <h2 className="text-2xl font-semibold text-[#F8FAF6]">VRA Recommendation</h2>
                                            <p className="text-white/60 font-light text-sm leading-relaxed">Convert health data into prioritized Variable Rate Application (VRA) interventions.</p>
                                        </div>
                                    </div>
                                    <div className="relative bg-white/[0.02] rounded-3xl p-5 border border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] flex flex-col justify-center gap-2 overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(239,68,68,0.05),transparent_60%)]" />
                                        
                                        {/* Action 1 */}
                                        <div className="relative z-10 bg-[#011712]/60 backdrop-blur-md p-2.5 px-3.5 rounded-xl border border-white/[0.05] flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-7 rounded-lg bg-[#ef4444]/20 text-[#ef4444] items-center justify-center">
                                                    <AlertTriangle className="size-3.5" strokeWidth={2.5} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-xs text-[#F8FAF6] leading-tight">Apply Fertilizer (Block A)</span>
                                                    <span className="text-[10px] text-white/50">Urgent Intervention</span>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] uppercase tracking-wider">Critical</span>
                                        </div>

                                        {/* Action 2 */}
                                        <div className="relative z-10 bg-[#011712]/60 backdrop-blur-md p-2.5 px-3.5 rounded-xl border border-white/[0.05] flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-7 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] items-center justify-center">
                                                    <Droplets className="size-3.5" strokeWidth={2.5} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-xs text-[#F8FAF6] leading-tight">Schedule Pruning (Block B)</span>
                                                    <span className="text-[10px] text-white/50">Preventive Measure</span>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] uppercase tracking-wider">High</span>
                                        </div>

                                        {/* Action 3 */}
                                        <div className="relative z-10 bg-[#011712]/60 backdrop-blur-md p-2.5 px-3.5 rounded-xl border border-white/[0.05] flex items-center justify-between shadow-sm opacity-80">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-7 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] items-center justify-center">
                                                    <Target className="size-3.5" strokeWidth={2.5} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-xs text-[#F8FAF6] leading-tight">Routine Monitoring</span>
                                                    <span className="text-[10px] text-white/50">Normal Schedule</span>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-[#3b82f6]/20 text-[#3b82f6] uppercase tracking-wider">Low</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 5: Reports & Analytics */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                            className="col-span-full lg:col-span-3"
                        >
                            <Card className="relative overflow-hidden h-full !bg-white/[0.02] backdrop-blur-3xl !border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] hover:!bg-white/[0.05] hover:!border-white/[0.12] transition-all duration-500 group">
                                <CardContent className="grid h-full pt-8 sm:grid-cols-2 gap-8">
                                    <div className="relative z-10 flex flex-col justify-center space-y-6">
                                        <div className="relative flex aspect-square size-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[#4ade80] items-center justify-center group-hover:bg-[#10b981]/10 transition-colors duration-500">
                                            <BarChart3 className="size-6" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-3">
                                            <h2 className="text-2xl font-semibold text-[#F8FAF6]">Analysis Reports</h2>
                                            <p className="text-white/60 font-light text-sm leading-relaxed">Generate structured reports and operational records from plantation analysis results, including plantation summaries, organizational overviews, and user activity tracking for monitoring and decision-making.</p>
                                        </div>
                                    </div>
                                    <div className="relative border-l border-white/10 pl-6 flex flex-col justify-center gap-4">
                                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between text-sm text-[#F8FAF6]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-2.5 rounded-full bg-[#4ade80]" />
                                                <span>Plantation Report.pdf</span>
                                            </div>
                                            <span className="text-white/40 font-medium">Ready</span>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between text-sm text-[#F8FAF6]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-2.5 rounded-full bg-[#4ade80]" />
                                                <span>Monthly Overview.pdf</span>
                                            </div>
                                            <span className="text-white/40 font-medium">Ready</span>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between text-sm text-[#F8FAF6]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-2.5 rounded-full bg-[#4ade80]" />
                                                <span>User Activity Log.xlsx</span>
                                            </div>
                                            <span className="text-white/40 font-medium">Ready</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
