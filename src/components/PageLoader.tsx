const PageLoader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando"
      className="min-h-[60vh] flex items-center justify-center bg-[#FAFAFA]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
        <span className="text-xs tracking-[0.2em] uppercase text-[#444] font-medium">
          Carregando
        </span>
      </div>
    </div>
  );
};

export default PageLoader;
