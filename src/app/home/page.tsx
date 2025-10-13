import Image from 'next/image'; // Imageコンポーネクトをインポート

export default function HomePage() {
  return (
    <div>
      <h1 className="font-bold text-7xl mb-8 flex items-center justify-center">Restaurant italy</h1>
      <br />
      <p className="flex items-center justify-center mb-8">ようこそ！レストランイタリィへ</p>
      <br />

      {/* トップ画像を表示 */}
      <div className="relative w-full h-[500px]"> {/* 画像とH1タイトルの間に余白 */}
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

      {/*
          ヘッダーに移動したため、以下のリンクは削除しました
          <Link href="/showMenu" ...>
          <Link href="/login" ...>
          <Link href="/userInsert" ...>
        */}
    </div>
  );
}