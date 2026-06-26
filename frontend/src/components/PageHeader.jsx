const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-r from-[#800000] to-rose-950 text-white py-16 px-28 text-center relative overflow-hidden border-b-4 border-[#87CEEB]">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-lg text-slate-200 font-semibold tracking-wide max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;