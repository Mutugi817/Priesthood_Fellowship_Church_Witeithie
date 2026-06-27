
const EmptyState = ({ icon: Icon, title, message }) => {
  return (
    <div className='flex flex-col items-center justify-center text-center py-16 px-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800'>
      <div className='w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center text-[#800000] dark:text-[#448ee4] mb-4'>
        {Icon && <Icon size={28} />}
      </div>
      <h4 className='text-lg font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider'>
        {title}
      </h4>
      <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed'>
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
