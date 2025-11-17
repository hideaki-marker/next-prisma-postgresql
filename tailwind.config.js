// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ★★★ 最も重要な設定 ★★★
  content: [
    // アプリケーションのすべてのコンポーネント、ページ、ライブラリファイルを指定
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // srcフォルダを使っている場合
    // cvaが使われている場所も確実にスキャン対象に入れる
    './lib/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      fontFamily: {
        // ★ 'sans' (デフォルトのフォント) を Noto Sans JP に置き換える
        // 変数名は `notoSansJp.variable` で指定した `--font-noto` を使う
        sans: ['var(--font-zenkaku)', 'sans-serif'], 
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // shadcnで使われていることが多いプラグイン
  ],
}