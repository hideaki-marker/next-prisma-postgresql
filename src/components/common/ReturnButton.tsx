// components/ReturnButton.tsx
'use client';
import { Button } from "@/components/ui/button";

export default function ReturnButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const href = isLoggedIn ? '/myPage' : '/home';
  
  return (
    <a href={href}>
      <div className="flex items-center justify-center mb-16">
      <Button
        variant="outline"
        className="bg-black text-white hover:bg-gray-800 hover:text-white text-2xl !px-12 !py-6"
      >
        戻る
      </Button>
      </div>
    </a>
  );
}