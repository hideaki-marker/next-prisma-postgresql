'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// スライドデータの定義
const SLIDES = [
  {
    id: 1,
    title: "オニオングラタンスープ",
    subTitle: "Onion Soup with Bread & Cheese",
    description: "感動！\nたまねぎの甘みたっぷり\nオニオングラタンスープ",
    price: 273, // 数値にしておくと後の計算が楽になります
    image: "/onionsoup.png"
  },
  {
    id: 2,
    title: "ミラノ風ドリア",
    subTitle: "Milanese Rice Gratin",
    description: "創業以来のこだわり！\nコクのあるターメリックライスと\nホワイトソースのハーモニー",
    price: 273,
    image: "/doria.png"
  },
  {
    id: 3,
    title: "ストロベリーパフェ",
    subTitle: "Fresh Strawberry Parfait",
    description: "旬の苺を贅沢に！\n甘酸っぱい苺ソースと\n濃厚ミルクジェラートの共演",
    price: 454,
    image: "/Strawberry Parfait.png"
  }
];

export default function TopSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // ★追加：一時停止の状態を管理する
  const [isPaused, setIsPaused] = useState(false);

  // 自動スライド機能（4秒ごと）
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex]); // ★currentIndexも監視してタイマーをリセット
  
  const currentSlide = SLIDES[currentIndex];

  // キーボードナビゲーション
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // スライダーにフォーカスがある時や、ページ全体での操作を想定
    if (e.key === 'ArrowLeft') {
      setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    } else if (e.key === 'ArrowRight') {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []); // 空の配列でOK。ブラウザ全体でキー入力を監視します。

  return (
    <section className="w-full py-12 flex flex-col items-center">
      <div className="w-full max-w-6xl px-4">
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row items-center w-full min-h-[500px]"
        >
          
          {/* --- 左側：画像エリア（フェードアニメーション） --- */}
          <div className="w-full md:w-1/2 p-4 relative h-[450px]">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-4 transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                  <Image 
                    src={slide.image} 
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
            
            {/* Since 2025 バッジは常に一番上に表示 */}
            <div className="absolute top-8 left-8 bg-[#8B2E2E] text-white rounded-full w-16 h-16 flex flex-col items-center justify-center text-[10px] font-bold border-2 border-white z-20 shadow-lg">
              <span>Since</span>
              <span className="text-sm">2025</span>
            </div>
          </div>

          {/* --- 右側：テキストエリア（ここもふわっと切り替える） --- */}
          <div className="w-full md:w-1/2 p-12 flex flex-col items-center text-center relative h-[300px] justify-center">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 p-12 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                  index === currentIndex 
                    ? 'opacity-100 translate-y-0 z-10' 
                    : 'opacity-0 translate-y-4 z-0'
                }`}
              >
                <div className="space-y-2">
                  <h2 className="text-[#8B5E3C] text-4xl font-bold font-serif">{slide.title}</h2>
                  <p className="text-[#8B5E3C] text-xl italic font-serif opacity-80">{slide.subTitle}</p>
                </div>
                <div className="mt-6 space-y-4">
                  <p className="text-[#D32F2F] font-bold text-lg leading-relaxed whitespace-pre-wrap">{slide.description}</p>
                  <div className="flex items-baseline justify-center gap-x-2">
                    <span className="text-3xl font-bold text-gray-800">{slide.price}円</span>
                    <span className="text-sm text-gray-600">(税込{Math.floor(slide.price * 1.1)}円)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* インジケーター */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-x-2 z-30">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`スライド ${index + 1} を表示`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-[#D32F2F] w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}