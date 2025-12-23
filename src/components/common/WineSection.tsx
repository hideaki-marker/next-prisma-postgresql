import Image from 'next/image';
import Link from 'next/link';
import { TbPhotoPlus } from "react-icons/tb";

const WINES = [
  {
    id: 1,
    name: "ラブルスコ・セッコ",
    type: "赤・微発泡",
    description: "天然発酵の低アルコールワイン。\nお肉料理によく合います。",
    bottleprice: "1,100円",
    glassprice: "300円",
    image: "/redwine.png" // 後で画像を生成して配置しましょう！
  },
  {
    id: 2,
    name: "ベルデッキオ",
    type: "白・辛口",
    description: "フレッシュな果実味と、\n心地よい酸味が特徴です。",
    bottleprice: "1,100円",
    glassprice: "300円",
    image: "/whitewine.png"
  }
];

export default function WineSection() {
  return (
    <section className="bg-[#F8F5F2] py-20 px-4 w-full flex flex-col items-center">
      <div className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#4A2C2A] mb-4 font-serif italic">Wine List</h2>
          <div className="w-24 h-1 bg-[#8B5E3C] mx-auto mb-4"></div>
          <p className="text-[#8B5E3C] text-lg">イタリアの風を感じる、厳選直輸入ワイン</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {WINES.map((wine) => (
            <div key={wine.id} className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col sm:flex-row p-4 hover:shadow-2xl transition-all duration-300 border border-[#EBE3D5] group">
              {/* ワインの画像エリア */}
              <div className="w-full sm:w-2/5 relative h-72 sm:h-auto bg-[#FDFBF9] rounded-[30px] overflow-hidden flex items-center justify-center">
                {wine.image ? (
                    // 画像がある場合
                    <Image 
                    src={wine.image} 
                    alt={wine.name}
                    fill
                    className="object-cover p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    // 画像がない場合：アイコンを表示
                    <div className="flex flex-col items-center justify-center text-gray-300 w-full h-full">
                    <TbPhotoPlus size={64} strokeWidth={1} />
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-2">No Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* ワインの情報エリア */}
              <div className="w-full sm:w-3/5 p-6 flex flex-col">                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-1 bg-[#FDF2F2] text-[#D32F2F] rounded">
                    {wine.type}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{wine.name}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap text-sm">
                  {wine.description}
                </p>
                <div className="mt-auto border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">ボトル</span>
                  <span className="text-2xl font-bold text-[#8B5E3C]">{wine.bottleprice}</span>
                </div>
                <div className="mt-auto border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">グラス</span>
                  <span className="text-2xl font-bold text-[#8B5E3C]">{wine.glassprice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/wines">
          <div className="mt-16 text-center">
            <span className="inline-block border-2 border-[#4A2C2A] text-[#4A2C2A] px-10 py-3 rounded-full font-bold hover:bg-[#4A2C2A] hover:text-white transition-all duration-300 shadow-md">
                すべてのワインを見る
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}