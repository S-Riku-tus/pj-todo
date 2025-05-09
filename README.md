# Todo App

シンプルで使いやすいTodoアプリケーション。Next.js（フロントエンド）とFastAPI（バックエンド）を使用しています。

## 機能

- ユーザー認証（登録・ログイン）
- Todoの作成、表示、更新、削除
- クールなダークテーマUI

## 技術スタック

### フロントエンド
- Next.js
- TypeScript
- Tailwind CSS
- React Hooks

### バックエンド
- FastAPI
- SQLAlchemy
- Alembic (データベースマイグレーション)
- Pydantic

## セットアップ方法

### バックエンド

1. バックエンドディレクトリに移動
```bash
cd backend
```

2. 仮想環境を作成して有効化
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. 依存関係をインストール
```bash
pip install -r requirements.txt
```

4. データベースのマイグレーション
```bash
alembic upgrade head
```

5. バックエンドサーバーを起動
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### フロントエンド

1. 別のターミナルウィンドウを開き、フロントエンドディレクトリに移動
```bash
cd frontend
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 にアクセス

## APIエンドポイント

### 認証
- POST /api/v1/auth/register - 新規ユーザー登録
- POST /api/v1/auth/login/access-token - ログイン（トークン取得）
- POST /api/v1/auth/login/test-token - トークンテスト

### ユーザー
- GET /api/v1/users/me - 現在のユーザー情報を取得
- PUT /api/v1/users/me - ユーザー情報を更新

### Todo
- GET /api/v1/todos/ - Todoリストを取得
- POST /api/v1/todos/ - 新しいTodoを作成
- GET /api/v1/todos/{todo_id} - 特定のTodoを取得
- PUT /api/v1/todos/{todo_id} - Todoを更新
- DELETE /api/v1/todos/{todo_id} - Todoを削除 