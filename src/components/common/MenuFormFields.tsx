"use client";

import { Control, FieldValues } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ★変更点★: formSchemasをインポート
import { commonMenuSchema } from "./formSchemas";

import { z } from "zod";

// ★変更点★: Propsの型を具体的な型に制約
type MenuFormData = z.infer<typeof commonMenuSchema>;

interface MenuFormFieldsProps {
  control: Control<MenuFormData>;
  menuTypeOptions: string[];
}

export function MenuFormFields({ control, menuTypeOptions }: MenuFormFieldsProps) {
  return (
    <>
      {/* メニュー名フィールド */}
      <FormField
        control={control}
        name="menuName"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>メニュー名</FormLabel>
            <FormControl className="w-full flex justify-center">
              <Input type="text" placeholder="名前" {...field} className="w-2/3 mx-auto" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

      {/* 価格フィールド */}
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>価格</FormLabel>
            <FormControl className="w-full flex justify-center">
              <Input
                type="number"
                placeholder="価格"
                {...field}
                value={field.value === 0 ? '' : field.value}
                className="w-2/3 mx-auto [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

      {/* ラジオグループフィールド */}
      <FormField
        control={control}
        name="orderFlg"
        render={({ field }) => (
          <FormItem className="space-y-3 flex flex-col items-center">
            <FormLabel>オーダー可</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value ?? 0)}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="1" />
                  </FormControl>
                  <FormLabel className="font-normal">可</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="0" />
                  </FormControl>
                  <FormLabel className="font-normal">不可</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

      {/* セレクトボックスフィールド */}
      <FormField
        control={control}
        name="menuType"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>カテゴリー</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl className="w-full flex justify-center">
                <SelectTrigger className="w-2/3 mx-auto">
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {menuTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

      {/* メニュー説明テキストエリアフィールド */}
      <FormField
        control={control}
        name="detail"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center">
            <FormLabel>メニュー説明</FormLabel>
            <FormControl className="w-full flex justify-center">
              <Textarea
                placeholder="メニューの詳細な説明を入力してください。"
                className="resize-y w-2/3 mx-auto"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}