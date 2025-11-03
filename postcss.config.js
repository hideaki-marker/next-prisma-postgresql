const config = {
  plugins: {
    // Tailwind CSS プラグイン
    // ★★★ これが最新の標準です ★★★
    "@tailwindcss/postcss": {},
    
    // ベンダープレフィックス（-webkit-など）を自動で付与するプラグイン
    autoprefixer: {},
  },
};
export default config;