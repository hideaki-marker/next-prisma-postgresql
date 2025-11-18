import Link from 'next/link';
import { UserCog } from 'lucide-react';

export default function AdminBar() {
    return (
        // ★★★ 修正: fixed bottom-0 left-0 right-0 を追加 ★★★
       <footer className="p-2 !bg-gray-900 !text-white shadow-lg w-full h-10">
            <div className="container mx-auto flex justify-start">
                <Link href="/adminLogin" className="flex items-center text-sm hover:text-gray-300">
                    管理者ログイン
                </Link>
            </div>
        </footer>
    );
}