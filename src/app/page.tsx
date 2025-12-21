'use client'; // ★1. クライアントコンポーネントであることを宣言
import { useState, useEffect } from 'react'; // ★2. Reactの機能をインポート
import Image from 'next/image'; // Imageコンポーネクトをインポート

// ★3. 表示したいスライドのデータを配列にする
const SLIDES = [
  {
    id: 1,
    title: "オニオングラタンスープ",
    subTitle: "Onion Soup with Bread & Cheese",
    description: "感動！\nたまねぎの甘みたっぷり\nオニオングラタンスープ",
    price: "273円",
    taxPrice: "300円",
    image: "/onionsoup.png"
  },
  {
    id: 2,
    title: "ミラノ風ドリア",
    subTitle: "Milanese Rice Gratin",
    description: "創業以来のこだわり！\nコクのあるターメリックライスと\nホワイトソースのハーモニー",
    price: "273円",
    taxPrice: "300円",
    image: "/doria.png"
  }
];

export default function HomePage() {

  const [currentIndex, setCurrentIndex] = useState(0);

  // ★5. 自動でスライドを切り替えるタイマーを設定
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, 5000); // 5秒ごとに切り替え
    return () => clearInterval(timer); // コンポーネントが消える時にタイマーを止める
  }, []);

  const currentSlide = SLIDES[currentIndex];
  return (
    
      <section className="w-full py-12 flex flex-col items-center">

        <div></div>
      <div className="container mx-auto max-w-6xl flex justify-center">
        {/* ★6. transition-opacity でふわっと切り替える */}
        <div className="relative bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row items-center transition-all duration-700 w-full">
          
          {/* 左側：画像エリア */}
          <div className="w-full md:w-1/2 p-4">
            <div className="relative h-[400px] w-full rounded-[30px] overflow-hidden">
              <Image 
                src={currentSlide.image} 
                alt={currentSlide.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-opacity duration-700"
              />              <div className="absolute top-6 left-6 bg-[#8B2E2E] text-white rounded-full w-16 h-16 flex flex-col items-center justify-center text-[10px] font-bold border-2 border-white">
                <span>Since</span>
                <span className="text-sm">2025</span>
              </div>
            </div>
          </div>

          {/* 右側：テキストエリア */}
          <div className="w-full md:w-1/2 p-12 space-y-6 flex flex-col items-center text-center">
            <div className="space-y-2">
              <h2 className="text-[#8B5E3C] text-4xl font-bold">{currentSlide.title}</h2>
              <p className="text-[#8B5E3C] text-xl italic font-serif opacity-80">{currentSlide.subTitle}</p>
            </div>
            <div className="space-y-4">
              <p className="text-[#D32F2F] font-bold text-lg leading-relaxed whitespace-pre-wrap">
                {currentSlide.description}
              </p>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-gray-800">{currentSlide.price}</span>
                <span className="text-sm text-gray-600">(税込{currentSlide.taxPrice})</span>
              </div>
            </div>
          </div>
          
          {/* ★7. インジケーター（ドット）を動的に生成 */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-x-2">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`スライド ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#D32F2F]' : 'bg-gray-300'
                }`}
              />            ))}
          </div>
        </div>
      </div>
      {/* トップ画像を表示 */}
      <div className="relative w-full aspect-video"> {/* 画像とH1タイトルの間に余白 */}
        <Image
          src="/toppage.png" // publicディレクトリからの相対パス
          alt="Restaurant Italy Top Image"
          fill // ★ fillプロパティを追加
          style={{ objectFit: 'cover' }} // ★ 画像が親要素に収まるように設定
          //width={800}  画像の幅をピクセルで指定
          //height={500}  画像の高さをピクセルで指定
          priority // LCP (Largest Contentful Paint) を改善するために優先的にロード
          className="rounded-lg shadow-lg" // Tailwind CSSで角丸と影を追加
        />
      </div>
    </section>
    
  );
}