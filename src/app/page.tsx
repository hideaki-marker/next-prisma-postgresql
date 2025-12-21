'use client'; // ★1. クライアントコンポーネントであることを宣言
import { useState, useEffect } from 'react'; // ★2. Reactの機能をインポート
import Image from 'next/image'; // Imageコンポーネクトをインポート
import TopSlider from '@/components/common/TopSlider';

export default function HomePage() {

  return (
    
      <section className="w-full py-12 flex flex-col items-center">

        <div></div>
      <div className="container mx-auto max-w-6xl flex justify-center">
        {/* ★6. transition-opacity でふわっと切り替える */}
        <div className="relative bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row items-center transition-all duration-700 w-full">
          <TopSlider />
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