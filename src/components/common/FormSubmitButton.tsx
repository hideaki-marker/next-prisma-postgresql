import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // ローディングアイコンをインポート
import { cn } from "@/lib/utils";
import * as React from 'react';

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;
// コンポーネントが受け取る Props の型を定義
interface FormSubmitButtonProps extends ButtonProps {
  isLoading: boolean;
  loadingText?: string; // ローディング中に表示するテキスト（オプション）
  children: React.ReactNode; // 通常時に表示するボタンのテキスト/コンテンツ
}

export const FormSubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
  ({ isLoading, loadingText = "処理中...", children, className, ...props }, ref) => {
    
    return (
      <Button
        ref={ref}
        type="submit"
        disabled={isLoading}
        // 既存の className と共通スタイルを結合
        className={cn("w-full h-10 min-h-10", className)}
        {...props} // その他の ButtonProps (variant, size など) を展開
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);

// デバッグや表示用の名前を設定
FormSubmitButton.displayName = "FormSubmitButton";