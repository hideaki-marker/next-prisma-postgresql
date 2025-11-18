import Link from 'next/link';

export default function AdminBar() {
    return (
        
       <footer className="p-2 !bg-gray-900 !text-white shadow-lg w-full h-10">
            <div className="container mx-auto flex justify-start">
                <Link href="/adminLogin" className="flex items-center text-sm hover:text-gray-300">
                    管理者ログイン
                </Link>
            </div>
        </footer>
    );
}