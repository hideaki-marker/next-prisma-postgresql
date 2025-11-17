FROM node:18-alpine

# ビルドに必要なツールをインストール (もしPrismaなどのために必要なら残す)
RUN apk add --no-cache python3 g++ make git

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json を先にコピー
COPY package.json yarn.lock ./

# プロジェクトの依存関係をインストール
# これで `tailwindcss` が `node_modules` に入るはずです。
# 2. プロジェクトの依存関係を Yarn でインストール
RUN yarn install --frozen-lockfile

# アプリケーションのすべてのファイルをコピー
COPY . .

# もしビルドステップが必要であればここに追加
# RUN npm run build

# 3. コンテナ起動時のコマンドも yarn に変更
CMD ["yarn", "dev"]