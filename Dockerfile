FROM node:18-alpine

# ビルドに必要なツールをインストール (もしPrismaなどのために必要なら残す)
RUN apk add --no-cache python3 g++ make git

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json を先にコピー
COPY package*.json ./

# プロジェクトの依存関係をインストール
# これで `tailwindcss` が `node_modules` に入るはずです。
RUN npm install --legacy-peer-deps

# アプリケーションのすべてのファイルをコピー
COPY . .

# もしビルドステップが必要であればここに追加
# RUN npm run build

# コンテナ起動時に実行するコマンド (例: 開発サーバー起動)
# CMD ["npm", "run", "dev"]