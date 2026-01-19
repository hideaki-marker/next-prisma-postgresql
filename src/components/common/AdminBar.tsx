import Link from 'next/link';

export default function AdminBar() {
    return (
        
       <footer className="p-2 !bg-gray-900 !text-white shadow-lg w-full h-16">
            <div className="container mx-auto flex justify-end items-center h-full px-6">
                <Link href="/adminLogin" className="text-base hover:text-gray-500 font-medium">
                    管理者ログイン
                </Link>
            </div>
        </footer>
    );
}