'use client'; // ブラウザで動作することを明示

export default function PageTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="pb-20 flex justify-center">
      <button 
        onClick={scrollToTop}
        className="text-gray-400 hover:text-[#4A2C2A] transition-colors flex items-center gap-2 group"
      >
        <span className="transition-transform group-hover:-translate-y-1">↑</span> 
        Page Top
      </button>
    </div>
  );
}